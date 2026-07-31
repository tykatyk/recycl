// import { CronJob } from 'cron'
// import { rebuildSuperclusterIndexQueue } from 'worker/src/queue'
// import { JOB_REBUILD_SUPERCLUSTER_INDEX } from '@recycl/shared/dist/server/worker'
import Supercluster from 'supercluster'
import type {
  AdFeature,
  WasteAdClusterProperties,
  BBox,
} from '@recycl/shared/dist/server/types'
import { dbConnect, AdModel } from '@recycl/shared/dist/server/db'
import WasteTypeModel from '@recycl/shared/dist/server/db/models/wasteType'
import mongoose from 'mongoose'
import type { Lng, Lat } from '@recycl/shared/dist/server/types'

type AggregatedAd = {
  _id: string
  weight: number
  totalAds: number
  wasteType: string
  firstAdId: mongoose.Types.ObjectId
  firstAdTitle: string
  wasteLocation: {
    position: {
      coordinates: [Lng, Lat]
    }
    description: string
    placeId: string
  }
}

const indexMap = new Map<
  string,
  Supercluster<AdFeature, WasteAdClusterProperties>
>()
let refreshPromise: Promise<any> | null = null
let lastRebuild: Date | null = null

export const getClusters = async (
  bbox: BBox,
  zoom: number,
  wasteType: string,
) => {
  if (!lastRebuild) {
    await rebuildIndexOnServer()
    lastRebuild = new Date()
    console.log('Supercluster initiated successfully')
    //automatically update the index if this function is invoked more than 1 minute ago
  } else if (Date.now() - lastRebuild.getTime() > 60000) {
    //await here so that we don't wait for the index to be rebuilt
    rebuildIndexOnServer()
    lastRebuild = new Date()
  }

  const index = indexMap.get(wasteType)
  if (!index) return []

  return index.getClusters(bbox, zoom)
}

const getPopulatedIndex = (ads: AggregatedAd[]) => {
  const index = new Supercluster<AdFeature, WasteAdClusterProperties>({
    radius: 40,
    maxZoom: 16,
    map: (props) => ({
      totalWeight: props.weight,
    }),
    reduce: (accumulated, props) => {
      accumulated.totalWeight += props.totalWeight
    },
  })

  index.load(
    ads.map((ad) => {
      const { wasteLocation, weight, totalAds } = ad
      const [lng, lat] = wasteLocation.position.coordinates

      return {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [lng, lat],
        },
        properties: {
          wasteType: ad.wasteType,
          weight,
          placeId: wasteLocation.placeId,
          placeDescription: wasteLocation.description,
          ...(totalAds === 1
            ? {
                adId: ad.firstAdId.toString(),
                title: ad.firstAdTitle,
              }
            : {
                totalAds,
              }),
        },
      }
    }),
  )

  return index
}

const rebuildIndexOnServer = async () => {
  try {
    if (refreshPromise) return

    await dbConnect()
    const wasteTypes = await WasteTypeModel.find().lean()

    refreshPromise = (async () => {
      //Build indexes per each waste type
      for (const wasteType of wasteTypes) {
        try {
          const adsByWasteType = await AdModel.aggregate<AggregatedAd>([
            {
              $match: {
                wasteType: { $eq: wasteType.name },
                expires: { $gt: new Date() },
                status: {
                  $eq: 'active',
                },
              },
            },
            {
              $group: {
                _id: '$wasteLocation.place_id',
                weight: { $sum: '$quantity' },
                totalAds: { $sum: 1 },
                // wasteTypeId: { $first: '$wasteType' },
                wasteType: { $first: wasteType.name },
                firstAdId: { $first: '$_id' },
                firstAdTitle: { $first: '$title' },
                wasteLocation: {
                  $first: {
                    position: {
                      coordinates: '$wasteLocation.position.coordinates',
                    },
                    description: '$wasteLocation.description',
                    placeId: '$wasteLocation.place_id',
                  },
                },
              },
            },
          ])
          const indexByWasteType = getPopulatedIndex(adsByWasteType)

          indexMap.set(wasteType.name, indexByWasteType)
        } catch (err) {
          console.log(err)
          throw new Error('Cannot create an index')
        }
      }
      refreshPromise = null
    })()
    return refreshPromise
  } catch (error) {
    console.error(error)
  }
}

// const rebuildIndexInQueue = async () => {
//   const counts = await rebuildSuperclusterIndexQueue.getJobCounts(
//     'waiting',
//     'active',
//     'delayed',
//   )

//   const { waiting, active, delayed } = counts

//   const hasPendingTasks = waiting || active || delayed
//   if (hasPendingTasks) {
//     console.log(
//       'Rebuild index task already exist in the queue. Skipping new task.',
//     )
//     return
//   }

//   rebuildSuperclusterIndexQueue.add(JOB_REBUILD_SUPERCLUSTER_INDEX, {
//     indexMap,
//   })
// }

// new CronJob(
//   '0 * * * * *', // run every minute
//   rebuildIndexInQueue, // onTick
//   null, // onComplete
//   true, // start
// )
