import dbConnect from '../../db/connection'
import {
  WasteRemovalEventModel,
  SubscriptionModel,
  UnsubscribeToken,
  RemovalApplicationModel,
} from '../../db/models'
import type {
  SubscribedUser,
  AggregatedRemovalApplication,
  WasteRemovalByLocation,
  WasteRemovalEvents,
  WasteRemovalNotification,
  WasteLocationCounter,
  WasteTypeCounter,
  AggregatedApplicationPerUser,
} from '../../types/subscription'
import cryptoRandomString from 'crypto-random-string'
import { maxJobDurationMs } from '.'
import type { PrepareSubscriptionData } from '../../types/subscription'

const noSubsVariantId = 'No subscription variant provided'

async function getSubscriptions(subscriptionVariantId: string) {
  if (!subscriptionVariantId) {
    console.log(noSubsVariantId)
    return []
  }
  const subscriptions = await SubscriptionModel.find({
    subscribed: true,
    variant: subscriptionVariantId,
    $or: [
      { lastSentAt: { $lte: new Date(Date.now() - maxJobDurationMs) } },
      { lastSentAt: null },
    ],
  }).populate<{ user: SubscribedUser }>('user', 'name email isBanned isActive')

  const filtered = subscriptions.filter((sub) => {
    return sub.user.isActive && !sub.user.isBanned
  })
  return filtered
}

const getRemovalApplicationsOld = async (subscribedUsers: SubscribedUser[]) => {
  const aggregatedRemovalApplications =
    await RemovalApplicationModel.aggregate<AggregatedApplicationPerUser>([
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
            $addToSet: { $each: '$wasteType' },
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

const getRemovalApplications = async (userId: string) => {
  const removalApplications =
    await RemovalApplicationModel.aggregate<AggregatedRemovalApplication>([
      {
        $match: {
          user: userId,
          isActive: true,
          // expires: { $gte: new Date() },
        },
      },
      {
        $group: {
          _id: '$waste_location.place_id',
          locationName: {
            $first: '$wasteLocation.structured_formatting.main_text',
          },
          wasteTypes: {
            $addToSet: { $each: '$wasteType' },
          },
        },
      },
      {
        $project: {
          _id: 0,
          locationId: '$_id',
          locationName: '$locationName',
          wasteTypes: '$wasteTypes',
        },
      },
    ])
  return removalApplications
}

//ToDo: only get events that are created after the last job
const getRemovalEvents = async () => {
  const removalEvents =
    await WasteRemovalEventModel.aggregate<WasteRemovalByLocation>([
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

export async function prepareSubscriptionData(subscriptionVariantId: string) {
  if (!subscriptionVariantId) {
    console.log(noSubsVariantId)
    return []
  }

  const subscriptionData: WasteRemovalNotification[] = []

  await dbConnect(process.env.DATABASE_URL)

  const subscriptions = await getSubscriptions(subscriptionVariantId)
  if (subscriptions.length === 0) return []

  const subscribedUsers = subscriptions.map((sub) => sub.user)

  const aggregatedRemovalApplications =
    await getRemovalApplicationsOld(subscribedUsers)
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

export const getWasteRemovalData = async (params: {
  userId: string
  lastRunDate: Date
}) => {
  const { userId, lastRunDate } = params

  const removalApplications = await getRemovalApplications(userId)
  if (removalApplications.length == 0) return []

  const data: WasteLocationCounter[] = []

  for (const removalApplication of removalApplications) {
    const { locationId, locationName, wasteTypes } = removalApplication
    const eventCounters: WasteTypeCounter[] = []

    for (const wasteName of wasteTypes) {
      const newAdsCount = await WasteRemovalEventModel.countDocuments({
        isActive: true,
        location: {
          place_id: locationId,
        },
        waste: wasteName,
        createdAt: {
          $gt: lastRunDate,
        },
        date: {
          $gt: new Date(Date.now() + 12 * 60 * 60 * 1000),
        },
      })

      if (newAdsCount === 0) continue
      eventCounters.push({ wasteName, newAdsCount })
    }
    if (eventCounters.length === 0) continue

    data.push({ locationId, locationName, adCounters: eventCounters })
  }
  return data
}
