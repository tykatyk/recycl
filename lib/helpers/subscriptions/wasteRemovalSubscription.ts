import {
  WasteRemovalEventModel,
  RemovalApplicationModel,
} from '../../db/models'
import type {
  AggregatedRemovalApplication,
  WasteLocationCounter,
  WasteTypeCounter,
} from '../../types/subscription'

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
