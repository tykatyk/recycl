import { Worker, Job } from 'bullmq'
import Supercluster from 'supercluster'

import {
  dbConnect,
  RemovalApplicationModel,
  WasteType as WasteTypeModel,
} from '@recycl/shared/dist/server/db'
import { redisConnection as redis } from '@recycl/shared/dist/server/redis'
import { QUEUE_REBUILD_SUPERCLUSTER_INDEX } from '@recycl/shared/dist/server/worker'
import type { SuperclusterFeatureParams } from '@recycl/shared/dist/server/types'

type RebuildSuperclusterJobData = {
  indexMap: Map<string, Supercluster<SuperclusterFeatureParams>>
}

export const rebuildSuperclusterIndexWorker =
  new Worker<RebuildSuperclusterJobData>(
    QUEUE_REBUILD_SUPERCLUSTER_INDEX,
    async (job: Job<RebuildSuperclusterJobData>) => {
      try {
        const { indexMap } = job.data

        await dbConnect()
        const wasteTypes = await WasteTypeModel.find().lean()

        for (const wasteType of wasteTypes) {
          try {
            const ads = await RemovalApplicationModel.find({
              wasteType,
              expires: { $gt: new Date() },
              status: 'active',
            }).lean()

            const index = new Supercluster<SuperclusterFeatureParams>({
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
            indexMap.set(wasteType.name, index)
          } catch (err) {
            console.log(err)
            throw new Error('Cannot create an index')
          }
        }
        console.log('Supercluster initiated successfully')
      } catch (error) {
        console.error(error)
      }
    },
    { connection: redis },
  )
