import { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '../../../lib/db/connection'
import { User, Event, RemovalApplication } from '../../../lib/db/models'
import { apiHandler } from '../../../lib/helpers/errorHelpers'
import type {
  SubscribedUser,
  AggregatedApplication,
  AggregatedEvent,
  Agent,
  WasteRemovalEvents,
  WasteRemovalByLocation,
  WasteRemovalNotification,
} from '../../../lib/types/subscription'

const subscriptionType = 'mobileStationAvailable'

async function getSubscribedUsers() {
  return await User.find({
    isBanned: false,
    isActive: true,
    subscriptions: subscriptionType,
  })
    .select('_id name email')
    .lean<SubscribedUser[]>()
}

const getRemovalApplications = async (subscribedUsers: SubscribedUser[]) => {
  const aggregatedRemovalApplications =
    await RemovalApplication.aggregate<AggregatedApplication>([
      {
        $match: {
          user: { $in: subscribedUsers.map((u) => u._id) },
          expires: { $gte: new Date() },
        },
      },
      {
        $group: {
          _id: {
            userId: '$user',
            locationId: '$wasteLocation.place_id',
          },
          //ToDo: change to locationId
          locationName: {
            $first: '$wasteLocation.structured_formatting.main_text',
          },
          docs: {
            $addToSet: '$wasteType',
          },
        },
      },

      {
        $group: {
          _id: '$_id.userId',
          docs: {
            $push: {
              locationId: '$_id.locationId',
              locationName: '$locationName',
              wasteTypes: '$docs',
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          userId: '$_id',
          docs: '$docs',
        },
      },
    ])
  return aggregatedRemovalApplications
}

const getRemovalEvents = async () => {
  const removalEvents = await Event.aggregate<AggregatedEvent>([
    {
      $match: {
        isActive: true,
        date: { $gte: new Date() },
      },
    },

    {
      $sort: {
        date: 1,
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'user',
        foreignField: '_id',
        as: 'populatedUser',
        pipeline: [
          {
            $project: {
              _id: 1,
              name: 1,
            },
          },
        ],
      },
    },
    { $unwind: '$populatedUser' },
    {
      $group: {
        _id: {
          userId: '$user',
          locationId: '$location.place_id',
          wasteType: '$waste',
        },
        locationName: { $first: '$location.structured_formatting.main_text' },
        agentName: { $first: '$populatedUser.name' },
        date: { $first: '$date' },
      },
    },
    {
      $group: {
        _id: {
          locationId: '$_id.locationId',
          wasteType: '$_id.wasteType',
        },
        locationName: { $first: '$locationName' },
        agentsByWasteType: {
          $push: {
            agentId: '$_id.userId',
            agentName: '$agentName',
            date: '$date',
          },
        },
      },
    },
    {
      $project: {
        _id: '$_id',
        locationName: '$locationName',
        agentsByWasteType: {
          $slice: ['$agentsByWasteType', 3], //max 3 agents to avoid long emails
        },
      },
    },
    {
      $group: {
        _id: '$_id.locationId',
        locationName: { $first: '$locationName' },
        docs: {
          $push: { wasteType: '$_id.wasteType', agents: '$agentsByWasteType' },
        },
      },
    },
    {
      $project: {
        _id: 0,
        locationId: '$_id',
        locationName: '$locationName',
        eventsByWasteType: '$docs',
      },
    },
  ])

  return removalEvents
}

const getNotifications = async () => {
  await dbConnect(process.env.DATABASE_URL)

  const subscribedUsers = await getSubscribedUsers()

  if (subscribedUsers.length === 0) return []

  const aggregatedRemovalApplications =
    await getRemovalApplications(subscribedUsers)

  const removalEvents = await getRemovalEvents()

  const removalEventsMap = new Map(
    removalEvents.map((re) => {
      const { locationId, eventsByWasteType, locationName } = re
      const eventsMap = new Map(
        eventsByWasteType.map((doc) => [doc.wasteType, doc.agents]),
      )
      return [locationId, { eventsMap, locationName }]
    }),
  )

  const userMap = new Map(
    subscribedUsers.map((u) => [
      u._id.toString(),
      { email: u.email, name: u.name },
    ]),
  )

  const removalApplications = aggregatedRemovalApplications.map(
    (application) => {
      const { userId, docs } = application
      const userIdString = userId.toString()
      const user = userMap.get(userIdString)

      return {
        userId: userIdString,
        userName: user?.name || '',
        userEmail: user?.email || '',
        docs,
      }
    },
  )

  const notifications: WasteRemovalNotification[] = []

  removalApplications.forEach(async (application) => {
    const locations: WasteRemovalByLocation = {}
    const notification: WasteRemovalNotification = {
      receiverEmail: application.userEmail,
      receiverName: application.userName,
      locations,
    }

    for (const doc of application.docs) {
      const locationId = doc.locationId

      const allEventsByLocation = removalEventsMap.get(doc.locationId)
      if (!allEventsByLocation) continue

      const removalbleWasteTypes: Record<string, Agent[]> = {}
      for (const wasteType of doc.wasteTypes) {
        const agents = allEventsByLocation.eventsMap.get(wasteType)
        if (!agents || agents.length === 0) continue

        if (!locations[locationId]) {
          locations[locationId] = {
            locationName: doc.locationName,
            wasteRemovalEvents: {} as WasteRemovalEvents,
          }
        }

        removalbleWasteTypes[wasteType] = agents

        locations[locationId].wasteRemovalEvents = removalbleWasteTypes
      }
    }

    if (Object.keys(notification.locations).length === 0) return

    notifications.push(notification)
  })

  return notifications
}

async function notifications(req: NextApiRequest, res: NextApiResponse) {
  //ToDo: Add token authorization
  if (req.method !== 'GET') {
    return res.status(405).end()
  }

  const notifications = await getNotifications()

  return res.json(notifications)
}

export default apiHandler(notifications)
