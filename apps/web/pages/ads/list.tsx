import {
  dbConnect,
  RemovalApplicationModel,
} from '@recycl/shared/dist/server/db'
import AdsOnList from '../../components/applications/AdsOnList'
import { INTERNAL_SERVER_ERROR } from '../../lib/errors'
import { adSearchFormSchema } from '../../lib/validation'
import getCoords from '../../lib/helpers/getCoords'
import { rowsPerPageOptions } from '../../lib/helpers/eventHelpers'

async function getPlaceCoordinates(placeId: string) {
  const existing = await RemovalApplicationModel.findOne({
    'wasteLocation.place_id': placeId,
  })

  if (existing) {
    return existing.wasteLocation.position.coordinates
  }

  return getCoords(placeId)
}

export default function AdsListView(props) {
  return <AdsOnList {...props} />
}

export async function getServerSideProps(context) {
  //ToDo: add verification that locationDescription really belongs to locationId
  const {
    searchRadius = 0,
    locationDescription = '',
    locationId = '',
    wasteType = '',
    page = 1,
    pageSize = 10,
  } = context.query

  await adSearchFormSchema.validate(
    { searchRadius, wasteLocation: locationDescription, wasteType },
    {
      stripUnknown: true,
    },
  )

  await dbConnect()

  const validPage = Number.parseInt(page ?? '', 10) || 1
  const validPageSize =
    Number.parseInt(pageSize ?? '', 10) || rowsPerPageOptions[0]

  const skip = Math.max(validPage - 1, 0) * validPageSize

  const filter: Record<string, unknown> = {
    status: 'active',
  }

  if (wasteType) {
    filter.wasteType = wasteType
  }

  if (locationDescription && locationId) {
    const coordinates = await getPlaceCoordinates(locationId)

    if (!coordinates || coordinates.length < 2) {
      return {
        props: {
          status: 'error',
          message: INTERNAL_SERVER_ERROR,
        },
      }
    }

    if (searchRadius) {
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
      filter['wasteLocation.place_id'] = locationId
    }
  }

  const query = RemovalApplicationModel.find(filter)
    .skip(skip)
    .limit(validPageSize)
    .sort({ updatedAt: -1 })
    .select('title user wasteLocation wasteType quantity updatedAt')
    .lean()

  const ads = await query

  return {
    props: {
      status: 'success',

      data: {
        ads: JSON.parse(JSON.stringify(ads)),
        wasteType,
        wasteLocation:
          locationDescription && locationId
            ? {
                description: locationDescription,
                place_id: locationId,
              }
            : null,
        searchRadius,
      },
    },
  }
}
