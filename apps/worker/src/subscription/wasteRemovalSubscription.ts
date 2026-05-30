import {
  WasteRemovalEventModel,
  RemovalApplicationModel,
} from '@recycl/shared/dist/server/db'
import type {
  AggregatedSubscriptionData,
  WasteLocationCounter,
  WasteTypeCounter,
} from './types'
import mongoose from 'mongoose'

const EARTH_RADIUS = 6_378

const getRemovalApplications = async (userId: string) => {
  const removalApplications =
    await RemovalApplicationModel.aggregate<AggregatedSubscriptionData>([
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId),
          isActive: true,
          // expires: { $gte: new Date() },
        },
      },
      {
        $group: {
          _id: '$wasteLocation.place_id',
          locationName: {
            $first: '$wasteLocation.structured_formatting.main_text',
          },
          coords: {
            $first: '$wasteLocation.position.coordinates',
          },
          allWasteTypes: {
            $push: '$wasteType',
          },
        },
      },
      {
        $project: {
          _id: 0,
          locationId: '$_id',
          locationName: '$locationName',
          coordinates: '$coords',
          wasteTypes: {
            $setUnion: ['$allWasteTypes'],
          },
        },
      },
    ])

  return removalApplications
}

export const getWasteRemovalData = async (params: {
  userId: string
  runId: string
  lastRunDate: Date
}) => {
  const { userId, runId, lastRunDate } = params
  const removalApplications = await getRemovalApplications(userId)

  if (removalApplications.length == 0) return []

  const data: WasteLocationCounter[] = []

  for (const removalApplication of removalApplications) {
    const { locationId, locationName, wasteTypes } = removalApplication
    const eventCounters: WasteTypeCounter[] = []

    for (const wasteName of wasteTypes) {
      const newAdsCount = await WasteRemovalEventModel.countDocuments({
        // location: {
        //   $near: removalApplication.coordinates,
        //   $maxDistance: 30_000 / EARTH_RADIUS,
        // },
        'location.position': {
          $geoWithin: {
            $centerSphere: [
              removalApplication.coordinates,
              removalApplication.radius / EARTH_RADIUS,
            ],
          },
        },
        // isActive: true,
        // 'location.place_id': locationId,

        // user: {
        //   $ne: new mongoose.Types.ObjectId(userId),
        // },
        // waste: wasteName,
        // createdAt: {
        //   $gt: lastRunDate,
        // },
        // date: {
        //   $gt: new Date(Date.now() + 12 * 60 * 60 * 1000),
        // },
      })

      if (newAdsCount === 0) continue
      eventCounters.push({ wasteName, newAdsCount })
    }
    if (eventCounters.length === 0) continue

    data.push({ locationId, locationName, adCounters: eventCounters })
  }

  return data
}
