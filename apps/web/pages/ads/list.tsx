import {
  dbConnect,
  RemovalApplicationModel,
} from '@recycl/shared/dist/server/db'
import AdsOnList from '../../components/applications/AdsOnList'
import { INTERNAL_SERVER_ERROR } from '../../lib/errors'
import { adSearchFormSchema } from '../../lib/validation'
import getCoords from '../../lib/helpers/getCoords'

async function getPlaceCoordinates(placeId: string) {
  const existing = await RemovalApplicationModel.findOne({
    'wasteLocation.place_id': placeId,
  })

  if (existing) {
    return existing.wasteLocation.position.coordinates
  }

  return getCoords(placeId)
}

export default function AdsListView({ ads }) {
  return <AdsOnList ads={ads} />
}

export async function getServerSideProps(context) {
  const { res } = context

  const {
    searchRadius = 0,
    wasteLocation,
    wasteType,
    page,
    limit,
  } = context.query as any

  await adSearchFormSchema.validate(
    { searchRadius, wasteLocation, wasteType },
    {
      stripUnknown: true,
    },
  )

  const validPage = Number.parseInt(page ?? '', 10) || 1
  const validLimit = Number.parseInt(limit ?? '', 10) || 10

  const skip = Math.max(validPage - 1, 0) * validLimit

  const filter: Record<string, unknown> = {
    status: 'active',
  }

  if (wasteType) {
    filter.wasteType = wasteType
  }

  if (wasteLocation) {
    if (searchRadius) {
      const coordinates = await getPlaceCoordinates(wasteLocation)

      if (!coordinates || coordinates.length < 2) {
        //ToDo return an error prop
        return res.status(500).json({
          error: INTERNAL_SERVER_ERROR,
          message: 'Cannot get coordinates',
        })
      }

      filter['wasteLocation.position'] = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates,
          },
          $maxDistance: searchRadius * 1000, // Distance in meters
        },
      }
    } else {
      filter['wasteLocation.place_id'] = wasteLocation
    }
  }

  await dbConnect()
  const query = RemovalApplicationModel.find(filter)
    .skip(skip)
    .limit(validLimit)
    .sort({ updatedAt: -1 })
    .select('title user wasteLocation.description wasteType quantity updatedAt')
    .lean()

  const ads = await query

  return {
    props: {
      ads: JSON.parse(JSON.stringify(ads)),
    },
  }
}
