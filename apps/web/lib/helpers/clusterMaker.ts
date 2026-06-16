import Supercluster from 'supercluster'
import { dbConnect } from '@recycl/shared/dist/server/db'
import {
  RemovalApplicationModel,
  WasteType,
} from '@recycl/shared/dist/server/db'

let index: Supercluster<any> | null = null
let indexMap = new Map()

let refreshPromise: Promise<void> | null = null
const refreshPromiseMap = new Map()

export const buildIndex = async (wasteType: string) => {
  if (refreshPromiseMap.has(wasteType)) refreshPromiseMap.get(wasteType)

  refreshPromise = (async () => {
    try {
      await dbConnect()
      const ads = await RemovalApplicationModel.find({
        wasteType,
        expires: { $gt: new Date() },
        status: 'active',
      }).lean()

      index = new Supercluster({ radius: 40, maxZoom: 16 })

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
              id: ad._id,
            },
          }
        }),
      )
      indexMap.set(wasteType, index)
    } catch (err) {
      console.log(err)
      throw new Error('Cannot create an index')
    } finally {
      refreshPromiseMap.delete(wasteType)
    }
  })()

  refreshPromiseMap.set(wasteType, refreshPromise)

  return refreshPromise
}

export const getClusters = async (
  bbox: [number, number, number, number],
  zoom: number,
  wasteType: string,
) => {
  if (!indexMap.get(wasteType)) await buildIndex(wasteType)
  if (indexMap.get(wasteType)) {
    return indexMap.get(wasteType).getClusters(bbox, zoom)
  }
  return null
}

const initSupercluster = async () => {
  const wasteTypes = await WasteType.find().lean()

  for (const wasteType of wasteTypes) {
    await buildIndex(wasteType.name)
  }
}

initSupercluster()
