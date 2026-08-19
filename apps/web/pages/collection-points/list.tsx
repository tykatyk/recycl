import { dbConnect, CollectionPointModel } from '@recycl/shared/dist/server/db'
import { INTERNAL_SERVER_ERROR } from '../../lib/errors'
import {
  adSearchFormSchema,
  paginationPageNumberSchema,
  paginationPageSizeSchema,
} from '../../lib/validation'
import getCoords from '../../lib/helpers/getCoords'
import { rowsPerPageOptions } from '../../lib/helpers/eventHelpers'
import * as yup from 'yup'
import CollectionPointsOnList, {
  type CollectionPointsOnListProps,
} from '../../components/collectionPoints/CollectionPointsOnList'
import { documentActivityStatus } from '@recycl/shared/dist/constants'

async function getPlaceCoordinates(placeId: string) {
  await dbConnect()
  const existing = await CollectionPointModel.findOne({
    'wasteLocation.place_id': placeId,
  })

  if (existing) {
    return existing.location.position.coordinates
  }

  return getCoords(placeId)
}

export default function CollectionPointsListView(
  props: CollectionPointsOnListProps,
) {
  return <CollectionPointsOnList {...props} />
}

export async function getServerSideProps(context) {
  //ToDo: add verification that locationDescription really belongs to locationId
  try {
    const {
      searchRadius = 0,
      locationDescription = '',
      locationId = '',
      wasteType = '',
      page = 1,
      pageSize = rowsPerPageOptions[0],
    } = context.query

    await adSearchFormSchema.validate(
      { searchRadius, wasteLocation: locationDescription, wasteType },
      {
        stripUnknown: true,
      },
    )

    const paginationValidationSchema = yup.object({
      page: paginationPageNumberSchema,
      pageSize: paginationPageSizeSchema,
    })

    const validatedQuery = await paginationValidationSchema.validate(
      { page, pageSize },
      {
        stripUnknown: true,
      },
    )

    const { page: validPage, pageSize: validPageSize } = validatedQuery

    const filter: Record<string, unknown> = {
      status: documentActivityStatus.active,
    }

    if (wasteType) {
      filter.wasteTypes = wasteType
    }

    const wasteLocation =
      locationDescription && locationId
        ? {
            description: locationDescription,
            place_id: locationId,
          }
        : null

    if (wasteLocation) {
      const coordinates = await getPlaceCoordinates(locationId)

      if (!coordinates || coordinates.length < 2) {
        throw new Error('Coordinates are incorrect')
      }

      if (searchRadius) {
        filter['location.position'] = {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates,
            },
            $maxDistance: searchRadius * 1000, // Distance in meters
          },
        }
      } else {
        filter['location.place_id'] = locationId
      }
    }

    await dbConnect()
    const skip = Math.max(validPage - 1, 0) * validPageSize
    const collectionPoints = await CollectionPointModel.find(filter)
      .skip(skip)
      .limit(validPageSize)
      .sort({ updatedAt: -1 })
      .select('user location wasteTypes date variant')
      .lean()

    return {
      props: {
        status: 'success',
        data: {
          ads: JSON.parse(JSON.stringify(collectionPoints)),
          wasteType,
          wasteLocation:
            locationDescription && locationId
              ? {
                  description: locationDescription,
                  place_id: locationId,
                }
              : null,
          searchRadius,
          pagination: {
            total: collectionPoints.length,
            page: validPage,
            pageSize: validPageSize,
          },
        },
      },
    }
  } catch (error) {
    return {
      props: {
        status: 'error',
        message: INTERNAL_SERVER_ERROR,
      },
    }
  }
}
