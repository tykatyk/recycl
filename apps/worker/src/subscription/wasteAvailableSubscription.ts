import type { WasteTypeCounter, WasteLocationCounter } from './types'
import {
  WasteAvailableSubscriptionModel,
  WasteRemovalEventModel,
  RemovalApplicationModel,
} from '@recycl/shared/dist/server/db'
import type { WasteAvailableSubscription } from '@recycl/shared/dist/server/db/models/wasteAvailableSubsciption'
import { redisConnection as redis } from '@recycl/shared/dist/server/redis'
import { Types } from 'mongoose'

const EARTH_RADIUS = 6_378_100

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
          $match: { user: new Types.ObjectId(userId) },
        },
        {
          $group: {
            _id: '$location.place_id',
            location: { $first: '$location' },
            radius: { $first: '$radius' },
            allWasteTypes: {
              $push: '$wasteTypes',
            },
            // wasteTypes: {
            //   $addToSet: { $each: '$wasteTypes' },
            // },
          },
        },
        {
          $sort: {
            'location.description': 1,
          },
        },
        {
          $project: {
            _id: 0,
            locationId: '$location.place_id',
            locationName: '$location.description',
            radius: '$radius',
            coordinates: '$location.position.coordinates',
            wasteTypes: {
              $reduce: {
                input: {
                  $reduce: {
                    input: '$allWasteTypes',
                    initialValue: [],
                    in: {
                      $concatArrays: ['$$value', '$$this'],
                    },
                  },
                },
                initialValue: [],
                in: {
                  $setUnion: ['$$value', ['$$this']],
                },
              },
            },
          },
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
      // const key = `WasteAvailableAdsCounter:${wasteType}`

      // const redisCounter = await redis.get(key)
      // if (redisCounter === null) {
      counter = await RemovalApplicationModel.countDocuments({
        wasteType: wasteType,
        'wasteLocation.position': {
          $geoWithin: {
            $centerSphere: [
              item.coordinates,
              (item.radius * 1000) / EARTH_RADIUS,
            ],
          },
        },

        isActive: true,
        // user: {
        //   $ne: new Types.ObjectId(userId),
        // },
        // createdAt: {
        //   $gt: lastRunDate,
        // },
        // date: { $gt: new Date(Date.now() + 12 * 60 * 60 * 1000) },
      })
      //   await redis.set(key, counter)
      //   await redis.expire(key, 30 * 60) //30 minutes
      // } else {
      //   counter = Number(redisCounter)
      // }

      if (!counter) continue
      wasteTypeCounters.push({ wasteName: wasteType, newAdsCount: counter })
    }

    if (wasteTypeCounters.length === 0) continue

    locations.push({
      //ToDo: remove country name from description
      locationName: item.locationName,
      locationId: item.locationId,
      adCounters: wasteTypeCounters,
    })
  }
  // console.log(items)
  if (locations.length === 0) return []
  return locations
}
