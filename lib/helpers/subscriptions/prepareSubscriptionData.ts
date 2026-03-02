import dbConnect from '../../db/connection'
import {
  Event,
  RemovalApplication,
  Subscription as SubscriptionModel,
  UnsubscribeToken,
} from '../../db/models'
import type {
  SubscribedUser,
  AggregatedApplication,
  WasteRemovalByLocation,
  WasteRemovalEvents,
  WasteRemovalNotification,
} from '../../types/subscription'
import cryptoRandomString from 'crypto-random-string'

//ToDo: receive subscription type as a parameter
const subscriptionType = '692d94649d358fe3fb068fdb'

async function getSubscriptions() {
  const subscriptions = await SubscriptionModel.find({
    subscribed: true,
    variant: subscriptionType,
    $or: [
      { lastSentAt: { $lte: new Date(Date.now() - 24 * 60 * 60 * 1000) } },
      { lastSentAt: null },
    ],
  }).populate<{ user: SubscribedUser }>('user', 'name email isBanned isActive')

  const filtered = subscriptions.filter((sub) => {
    return sub.user.isActive && !sub.user.isBanned
  })
  return filtered
}

const getRemovalApplications = async (subscribedUsers: SubscribedUser[]) => {
  const aggregatedRemovalApplications =
    await RemovalApplication.aggregate<AggregatedApplication>([
      {
        $match: {
          user: {
            $in: subscribedUsers.map((u) => u._id),
          },
          // expires: { $gte: new Date() },
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

//ToDo: only get events that are created after the last job
const getRemovalEvents = async () => {
  const removalEvents = await Event.aggregate<WasteRemovalByLocation>([
    {
      $match: {
        isActive: true,
        // date: { $gte: new Date() },
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

export async function prepareSubscriptionData() {
  const subscriptionData: WasteRemovalNotification[] = []

  await dbConnect(process.env.DATABASE_URL)

  const subscriptions = await getSubscriptions()
  if (subscriptions.length === 0) return []

  const subscribedUsers = subscriptions.map((sub) => sub.user)

  const aggregatedRemovalApplications =
    await getRemovalApplications(subscribedUsers)
  //ToDo: return if no applications, to avoid unnecessary processing of events

  const aggregatedRemovalEvents = await getRemovalEvents()
  //ToDo: return if no events, to avoid unnecessary processing of events

  const removalEventsMap = new Map(
    aggregatedRemovalEvents.map((reByLocation) => {
      const { locationId, locationName, eventsByLocation } = reByLocation
      const eventsByWasteType = new Map(
        eventsByLocation.map((doc) => [doc.wasteType, doc.eventsByWasteType]),
      )
      return [locationId, { locationName, eventsByWasteType }]
    }),
  )

  const removalApplicationsMap = new Map(
    aggregatedRemovalApplications.map((app) => [
      app.userId.toString(),
      app.docs,
    ]),
  )

  for (const subscription of subscriptions) {
    const userApplicationsByLocation = removalApplicationsMap.get(
      subscription.user._id.toString(),
    )
    if (!userApplicationsByLocation) continue

    const data: WasteRemovalNotification['data'] = []

    for (const doc of userApplicationsByLocation) {
      const { locationId, locationName, wasteTypes } = doc

      const eventsByLocation: WasteRemovalEvents[] = []

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

        eventsByLocation.push(removalbleWasteTypes)
      }

      if (eventsByLocation.length === 0) continue

      data.push({ locationId, locationName, eventsByLocation })
    }

    if (data.length === 0) continue

    const unsubscribeTokenValue = cryptoRandomString({
      length: 32,
      type: 'url-safe',
    })

    const unsubscribeTokenExpirationDate = new Date()
    unsubscribeTokenExpirationDate.setDate(
      unsubscribeTokenExpirationDate.getDate() + 90,
    )

    //ToDo: try catch and handle errors
    const unsubscribeToken = await UnsubscribeToken.create({
      subscription: subscription._id,
      value: unsubscribeTokenValue,
      expires: unsubscribeTokenExpirationDate,
      used: false,
    })

    if (!unsubscribeToken) {
      console.error(
        'Failed to create unsubscribe token for subscription',
        subscription._id,
      )
      continue
    }

    subscriptionData.push({
      receiverEmail: subscription.user.email,
      receiverName: subscription.user.name,
      unsubscribeToken: unsubscribeToken.value,
      listUnsubscribeToken: subscription.listUnsubscribeToken,
      data,
    })
  }

  return subscriptionData
}
