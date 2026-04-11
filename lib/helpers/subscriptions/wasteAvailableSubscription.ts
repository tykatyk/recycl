import {
  WasteAvailableSubscriptionModel,
  WasteRemovalEventModel,
} from '../../db/models'
import type {
  WasteTypeCounter,
  WasteLocationCounter,
} from '../../types/subscription'
import { redisConnection as redis } from '../../db/redisConnection'
import { WasteAvailableSubscription } from '../../db/models/wasteAvailableSubsciption'

export const getWasteAvailableData = async (params: {
  userId: string
  lastRunDate: Date
}) => {
  const { userId, lastRunDate } = params

  //ToDo: check if user is not banned

  //ToDo: add subscription type
  //1. Get all user's waste available subscriptions
  //2. For each subscription iterate over it's locations
  //3. For each location in the subscription get all waste types
  //4. For each waste type check Redis the count of the new waste removal proposal where locationId === location._id and wasteType === wasteType
  //5. If there is no record in Redis: get previously mentioned data from the db and put it to Redis

  const items =
    await WasteAvailableSubscriptionModel.aggregate<WasteAvailableSubscription>(
      [
        {
          $match: { user: userId },
        },
        {
          $group: {
            _id: '$location.place_id',
            location: { $first: '$location' },
            wasteTypes: {
              $addToSet: { $each: '$wasteTypes' },
            },
          },
        },
        {
          $replaceRoot: { newRoot: '$firstDoc' },
        },
      ],
    )

  if (items.length === 0) return []

  const locations: WasteLocationCounter[] = []

  for (const item of items) {
    const { location, wasteTypes } = item

    if (!wasteTypes || wasteTypes.length === 0) continue

    const wasteTypeCounters: WasteTypeCounter[] = []

    for (const wasteType of wasteTypes) {
      let counter = 0
      const key = `WasteAvailableAdsCounter:${wasteType}`

      const redisCounter = await redis.get(key)
      if (redisCounter === null) {
        counter = await WasteRemovalEventModel.countDocuments({
          waste: wasteType,
          location: {
            place_id: location.place_id,
          },
          createdAt: {
            $gt: lastRunDate,
          },
          date: { $gt: new Date(Date.now() + 12 * 60 * 60 * 1000) },
          isActive: true,
        })
        await redis.set(key, counter)
        await redis.expire(key, 30 * 60) //30 minutes
      } else {
        counter = Number(redisCounter)
      }

      if (!counter) continue
      wasteTypeCounters.push({ wasteName: wasteType, newAdsCount: counter })
    }
    if (wasteTypeCounters.length === 0) continue

    locations.push({
      //ToDo: remove country name from description
      locationName: location.description,
      locationId: location.place_id,
      adCounters: wasteTypeCounters,
    })
  }

  if (locations.length === 0) return []
  return locations
}
