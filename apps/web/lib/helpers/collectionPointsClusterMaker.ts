import Supercluster from 'supercluster'
import type {
  CollectionPointFeatureProperties,
  // ClusterProperties,
  BBox,
} from '@recycl/shared/dist/server/types'
import { dbConnect, CollectionPointModel } from '@recycl/shared/dist/server/db'
import type { CollectionPoint } from '../types/collectionPoint'
import WasteTypeModel from '@recycl/shared/dist/server/db/models/wasteType'
import mongoose from 'mongoose'
import type { Lng, Lat } from '@recycl/shared/dist/server/types'
import { collectionPointTypes } from '@recycl/shared/dist/constants'

type AggregatedCollectionPoint = {
  _id: string
  documents: [
    CollectionPoint & {
      _id: mongoose.Types.ObjectId
      variant: keyof typeof collectionPointTypes
    },
  ]
  wasteLocation: {
    position: {
      coordinates: [Lng, Lat]
    }
    description: string
    placeId: string
  }
  wasteType: string
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

const getPopulatedIndex = (ads: AggregatedCollectionPoint[]) => {
  const index = new Supercluster<CollectionPointFeatureProperties>({
    radius: 40,
    maxZoom: 16,
  })

  index.load(
    ads.map((ad) => {
      const { wasteLocation, documents } = ad
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
          ...(documents.length === 1
            ? {
                adId: documents[0]._id.toString(),
                wasteTypes: documents[0].wasteTypes,
                variant: documents[0].variant,
                phone: documents[0].phone,
                comment: documents[0].comment,
                ...(documents[0].variant === 'mobile' && {
                  date: documents[0].date,
                }),
              }
            : {
                totalAds: documents.length,
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
            await CollectionPointModel.aggregate<AggregatedCollectionPoint>([
              {
                $match: {
                  wasteTypes: wasteType.name,
                  // expires: { $gt: new Date() },
                  status: {
                    $eq: 'active',
                  },
                },
              },
              {
                $group: {
                  _id: '$location.place_id',
                  documents: { $push: '$$ROOT' },
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
              { $addFields: { wasteType: wasteType.name } },
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
