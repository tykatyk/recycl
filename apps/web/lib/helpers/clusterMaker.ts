import { CronJob } from 'cron'
import { dbConnect } from '@recycl/shared/dist/server/db'
import { rebuildSuperclusterIndexQueue } from 'worker/src/queue'
import { JOB_REBUILD_SUPERCLUSTER_INDEX } from '@recycl/shared/dist/server/worker'
import Supercluster from 'supercluster'
import type { SuperclusterFeatureParams } from '@recycl/shared/dist/server/types'

const indexMap = new Map<string, Supercluster<SuperclusterFeatureParams>>()

export const getClusters = async (
  bbox: [number, number, number, number],
  zoom: number,
  wasteType: string,
) => {
  const index = indexMap.get(wasteType)
  if (!index) return null
  return index.getClusters(bbox, zoom)
}

const rebuildIndex = async () => {
  await dbConnect()
  rebuildSuperclusterIndexQueue.add(JOB_REBUILD_SUPERCLUSTER_INDEX, {
    indexMap,
  })
}

new CronJob(
  '* */1 * * * *', // run every minute
  rebuildIndex, // onTick
  null, // onComplete
  true, // start
)
