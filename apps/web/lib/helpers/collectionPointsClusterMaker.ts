import Supercluster from 'supercluster'
import type {
  CollectionPointFeatureProperties,
  // ClusterProperties,
  BBox,
} from '@recycl/shared/dist/server/types'
import { dbConnect, CollectionPointModel } from '@recycl/shared/dist/server/db'
import WasteTypeModel from '@recycl/shared/dist/server/db/models/wasteType'
import mongoose from 'mongoose'
import type { Lng, Lat } from '@recycl/shared/dist/server/types'

type AggregatedAd = {
  _id: string
  totalAds: number
  wasteType: string
  firstAdId: mongoose.Types.ObjectId
  // firstAdTitle: string
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
  Supercluster<CollectionPointFeatureProperties>
>()
let refreshPromise: Promise<any> | null = null
let lastRebuild: Date | null = null

export const getCollectionPointClusters = async (
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
  const index = new Supercluster<CollectionPointFeatureProperties>({
    radius: 40,
    maxZoom: 16,
  })

  index.load(
    ads.map((ad) => {
      const { wasteLocation, totalAds } = ad
      const [lng, lat] = wasteLocation.position.coordinates

      return {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [lng, lat],
        },
        properties: {
          wasteType: ad.wasteType,
          placeId: wasteLocation.placeId,
          placeDescription: wasteLocation.description,
          ...(totalAds === 1
            ? {
                adId: ad.firstAdId.toString(),
                // title: ad.firstAdTitle,
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

    // const allAds: RemovalApplication[] = []

    await dbConnect()
    const wasteTypes = await WasteTypeModel.find().lean()

    refreshPromise = (async () => {
      //Build indexes per each waste type
      for (const wasteType of wasteTypes) {
        try {
          const adsByWasteType =
            await CollectionPointModel.aggregate<AggregatedAd>([
              {
                $match: {
                  wasteTypes: wasteType.name,
                  // $expr: { $in: [wasteType, '$wasteTypes'] },
                  // expires: { $gt: new Date() },
                  status: {
                    $eq: 'active',
                  },
                },
              },
              {
                $group: {
                  _id: '$location.place_id',
                  // weight: { $sum: '$quantity' },
                  totalAds: { $sum: 1 },
                  // wasteTypeId: { $first: '$wasteType' },
                  wasteType: { $first: wasteType.name },
                  firstAdId: { $first: '$_id' },
                  // firstAdTitle: { $first: '$title' },
                  wasteLocation: {
                    $first: {
                      position: {
                        coordinates: '$location.position.coordinates',
                      },
                      description: '$location.description',
                      placeId: '$location.place_id',
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
