import type {
  WasteTypeCounter,
  WasteLocationCounter,
  AggregatedSubscriptionData,
} from './types'
import {
  WasteAvailableSubscriptionModel,
  RemovalApplicationModel,
} from '@recycl/shared/dist/server/db'
import { redisConnection as redis } from '@recycl/shared/dist/server/redis'
import { Types } from 'mongoose'
import { EARTH_RADIUS } from './constants'

export const getWasteAvailableData = async (params: {
  userId: string
  runId: string
  lastRunDate: Date
}) => {
  const { userId, runId, lastRunDate } = params

  //ToDo: check if user is not banned

  //ToDo: add subscription type
  //1. Get all user's waste available subscriptions
  //2. For each subscription iterate over it's locations
  //3. For each location in the subscription get all waste types
  //4. For each waste type check Redis the count of the new waste removal proposal where locationId === location._id and wasteType === wasteType
  //5. If there is no record in Redis: get previously mentioned data from the db and put it to Redis

  const items = await WasteAvailableSubscriptionModel.aggregate<
    AggregatedSubscriptionData & { radius: number }
  >([
    {
      //filter out banned users
      $lookup: {
        from: 'users',
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ['$_id', new Types.ObjectId(userId)] },
                  { $eq: ['$isBanned', false] },
                ],
              },
            },
          },
        ],
        as: 'activeUsers',
      },
    },
    {
      $unwind: '$activeUsers',
    },
    {
      $match: { 'activeUsers._id': new Types.ObjectId(userId) },
    },
    {
      $group: {
        _id: '$location.place_id',
        location: { $first: '$location' },
        radius: { $first: '$radius' },
        allWasteTypes: {
          $push: '$wasteTypes',
        },
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
  ])

  if (items.length === 0) return []

  const locations: WasteLocationCounter[] = []

  for (const item of items) {
    const { wasteTypes, radius, coordinates } = item

    if (!wasteTypes || wasteTypes.length === 0) continue

    const wasteTypeCounters: WasteTypeCounter[] = []

    for (const wasteType of wasteTypes) {
      let counter = 0
      const key = `WasteAvailableAdsCounter:${runId}:${wasteType}`

      const cachedCounter = await redis.get(key)
      if (cachedCounter === null) {
        counter = await RemovalApplicationModel.countDocuments({
          wasteType: wasteType,
          'wasteLocation.position': {
            $geoWithin: {
              $centerSphere: [coordinates, radius / EARTH_RADIUS],
            },
          },

          isActive: true,
          user: {
            $ne: new Types.ObjectId(userId),
          },
          createdAt: {
            $gt: lastRunDate,
          },
          expires: { $gt: new Date(Date.now() + 12 * 60 * 60 * 1000) }, //12 hours ahead
        })
        await redis.set(key, counter)
        await redis.expire(key, 30 * 60) //30 minutes
      } else {
        counter = Number(cachedCounter)
      }

      if (!counter) continue
      wasteTypeCounters.push({ wasteName: wasteType, newAdsCount: counter })
    }

    if (wasteTypeCounters.length === 0) continue

    locations.push({
      locationName: item.locationName,
      locationId: item.locationId,
      adCounters: wasteTypeCounters,
    })
  }

  if (locations.length === 0) return []
  return locations
}
