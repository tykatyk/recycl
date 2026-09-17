import { Worker, Job } from 'bullmq'
import Supercluster from 'supercluster'

import {
  dbConnect,
  AdModel,
  WasteType as WasteTypeModel,
} from '@recycl/shared/dist/server/db/index.js'
import { redisConnection as redis } from '@recycl/shared/dist/server/redis/index.js'
import { QUEUE_REBUILD_SUPERCLUSTER_INDEX } from '@recycl/shared/dist/server/worker/index.js'
import type { AdFeature } from '@recycl/shared/dist/server/types.js'
import type { Ad } from '@recycl/shared/dist/server/db/models/ad.js'

type RebuildSuperclusterJobData = {
  indexMap: Map<string, Supercluster<AdFeature>>
}

const getPopulatedIndex = (ads) => {
  const index = new Supercluster<AdFeature>({
    radius: 40,
    maxZoom: 16,
  })

  index.load(
    ads.map((ad) => {
      const lng = ad.wasteLocation.position.coordinates[0]
      const lat = ad.wasteLocation.position.coordinates[1]

      return {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [lng, lat],
        },
        properties: {
          _id: ad._id,
        },
      }
    }),
  )
  return index
}

export const rebuildSuperclusterIndexWorker =
  new Worker<RebuildSuperclusterJobData>(
    QUEUE_REBUILD_SUPERCLUSTER_INDEX,
    async (job: Job<RebuildSuperclusterJobData>) => {
      try {
        const { indexMap } = job.data
        console.log(indexMap)
        return
        const allAds: Ad[] = []

        await dbConnect()
        const wasteTypes = await WasteTypeModel.find().lean()

        //Build indexes per each waste type
        for (const wasteType of wasteTypes) {
          try {
            const adsByWasteType = await AdModel.find({
              wasteType: wasteType.name,
              expires: { $gt: new Date() },
              status: 'active',
            }).lean<Ad[]>()

            const indexByWasteType = getPopulatedIndex(adsByWasteType)

            indexMap.set(wasteType.name, indexByWasteType)
            allAds.push(...adsByWasteType)
          } catch (err) {
            console.log(err)
            throw new Error('Cannot create an index')
          }
        }

        //Also build an index for all waste types
        const allAdsIndex = getPopulatedIndex(allAds)

        indexMap.set('all', allAdsIndex)
        console.log('Supercluster initiated successfully')
      } catch (error) {
        console.error(error)
      }
    },
    { connection: redis },
  )
