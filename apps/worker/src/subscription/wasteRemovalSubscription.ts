import {
  CollectionPointModel,
  AdModel,
  WasteRemovalSubscriptionModel,
} from '@recycl/shared/dist/server/db'
import { constants } from '@recycl/shared/dist'
const { documentActivityStatus } = constants

import type {
  AggregatedSubscriptionData,
  WasteLocationCounter,
  WasteTypeCounter,
} from './types'
import mongoose from 'mongoose'
import { EARTH_RADIUS } from './constants'

const getUserAds = async (userId: string) => {
  const ads = await AdModel.aggregate<AggregatedSubscriptionData>([
    {
      $match: {
        user: new mongoose.Types.ObjectId(userId),
        status: documentActivityStatus.active,
        expires: { $gte: new Date() },
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

  return ads
}

export const getWasteRemovalData = async (params: {
  userId: string
  runId: string
  lastRunDate: Date
}) => {
  const { userId, runId, lastRunDate } = params
  const userAds = await getUserAds(userId)

  if (userAds.length == 0) return []

  const data: WasteLocationCounter[] = []

  const subscriptionParams = await WasteRemovalSubscriptionModel.findOne({
    user: new mongoose.Types.ObjectId(userId),
  }).select('-_id radius')

  const collectionPointSearchRadius = subscriptionParams?.radius

  if (!collectionPointSearchRadius) return data

  for (const ad of userAds) {
    const { locationId, locationName, wasteTypes } = ad
    const eventCounters: WasteTypeCounter[] = []

    for (const wasteName of wasteTypes) {
      const newCollectionPointsCount =
        await CollectionPointModel.countDocuments({
          waste: wasteName,

          'location.position': {
            $geoWithin: {
              $centerSphere: [
                ad.coordinates,
                collectionPointSearchRadius / EARTH_RADIUS,
              ],
            },
          },
          isActive: true,
          user: {
            $ne: new mongoose.Types.ObjectId(userId),
          },
          createdAt: {
            $gt: lastRunDate,
          },
          //date exists only in mobile collection points
          date: {
            $gt: new Date(Date.now() + 12 * 60 * 60 * 1000), //12hours ahead
          },
        })

      if (newCollectionPointsCount === 0) continue
      eventCounters.push({ wasteName, newAdsCount: newCollectionPointsCount })
    }
    if (eventCounters.length === 0) continue

    data.push({ locationId, locationName, adCounters: eventCounters })
  }

  return data
}
