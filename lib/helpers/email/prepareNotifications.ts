import dbConnect from '../../../lib/db/connection'
import { User, Event, RemovalApplication } from '../../../lib/db/models'
import type {
  SubscribedUser,
  AggregatedApplication,
  WasteRemovalByLocation,
  WasteRemovalEvents,
  WasteRemovalNotification,
} from '../../../lib/types/subscription'

const subscriptionType = 'mobileStationAvailable'

async function getSubscribedUsers() {
  return await User.find({
    isBanned: false,
    isActive: true,
    subscriptions: subscriptionType,
    email: { $exists: true, $nin: [null, ''] },
  })
    .select('_id name email')
    .lean<SubscribedUser[]>()
}

const getRemovalApplications = async (subscribedUsers: SubscribedUser[]) => {
  const aggregatedRemovalApplications =
    await RemovalApplication.aggregate<AggregatedApplication>([
      {
        $match: {
          user: {
            $in: subscribedUsers.map((u) => u._id),
          },
          expires: { $gte: new Date() },
        },
      },
      {
        $group: {
          _id: {
            userId: '$user',
            locationId: '$wasteLocation.place_id',
          },
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
  const removalEvents = await Event.aggregate<WasteRemovalByLocation>([
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
        eventId: { $first: { $toString: '$_id' } },
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
        eventsByWasteType: {
          $push: {
            eventId: '$eventId',
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
        eventsByWasteType: {
          $slice: ['$eventsByWasteType', 3], //max 3 events to avoid long emails
        },
      },
    },
    {
      $group: {
        _id: '$_id.locationId',
        locationName: { $first: '$locationName' },
        docs: {
          $push: {
            wasteType: '$_id.wasteType',
            eventsByWasteType: '$eventsByWasteType',
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        locationId: '$_id',
        locationName: '$locationName',
        eventsByLocation: '$docs',
      },
    },
  ])

  return removalEvents
}

export default async function prepareNotifications() {
  await dbConnect(process.env.DATABASE_URL)

  const subscribedUsers = await getSubscribedUsers()

  if (subscribedUsers.length === 0) return []

  const aggregatedRemovalApplications =
    await getRemovalApplications(subscribedUsers)

  const aggregatedRemovalEvents = await getRemovalEvents()

  const removalEventsMap = new Map(
    aggregatedRemovalEvents.map((reByLocation) => {
      const { locationId, locationName, eventsByLocation } = reByLocation
      const eventsByWasteType = new Map(
        eventsByLocation.map((doc) => [doc.wasteType, doc.eventsByWasteType]),
      )
      return [locationId, { locationName, eventsByWasteType }]
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
    const notification: WasteRemovalNotification = {
      receiverEmail: application.userEmail,
      receiverName: application.userName,
      data: [],
    }

    for (const doc of application.docs) {
      const { locationId, locationName, wasteTypes } = doc
      const location: WasteRemovalByLocation = {
        locationId,
        locationName,
        eventsByLocation: [],
      }

      const allEventsByLocation = removalEventsMap.get(locationId)
      if (!allEventsByLocation) continue

      for (const wasteType of wasteTypes) {
        const eventsByWasteType =
          allEventsByLocation.eventsByWasteType.get(wasteType)
        if (!eventsByWasteType || eventsByWasteType.length === 0) continue

        const removalbleWasteTypes: WasteRemovalEvents = {
          wasteType,
          eventsByWasteType,
        }

        location.eventsByLocation.push(removalbleWasteTypes)
      }

      if (location.eventsByLocation.length === 0) continue
      notification.data.push(location)
    }

    if (notification.data.length === 0) return
    notifications.push(notification)
  })

  return notifications
}
