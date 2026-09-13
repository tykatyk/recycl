import { dbConnect, AdModel } from '@recycl/shared/dist/server/db'
import AdsOnList, { AdsOnListProps } from '../../components/ads/AdsOnList'
import { responseErrorCodes } from '../../lib/helpers/responses'
import {
  adSearchFormSchema,
  paginationPageNumberSchema,
  paginationPageSizeSchema,
} from '../../lib/validation'
import getCoords from '../../lib/helpers/getCoords'
import { rowsPerPageOptions } from '../../lib/helpers/eventHelpers'
import * as yup from 'yup'
import { wasteTypeNames } from '@recycl/shared/dist/constants'
const { INTERNAL_SERVER_ERROR } = responseErrorCodes

async function getPlaceCoordinates(placeId: string) {
  await dbConnect()
  const existing = await AdModel.findOne({
    'wasteLocation.place_id': placeId,
  })

  if (existing) {
    return existing.wasteLocation.position.coordinates
  }

  return getCoords(placeId)
}

export default function AdsListView(props: AdsOnListProps) {
  return <AdsOnList {...props} />
}

export async function getServerSideProps({ locale, query }) {
  const messages = {
    messages: (await import(`../../messages/${locale}.json`)).default,
  }

  try {
    //ToDo: add verification that locationDescription really belongs to locationId
    const {
      searchRadius = 0,
      locationDescription = '',
      locationId = '',
      wasteType = '',
      page = 1,
      pageSize = rowsPerPageOptions[0],
    } = query

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
      status: 'active',
    }

    if (wasteType && wasteTypeNames.includes(wasteType)) {
      filter.wasteType = wasteType
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

    await dbConnect()
    const skip = Math.max(validPage - 1, 0) * validPageSize
    const ads = searchRadius
      ? await AdModel.find(filter)
          .skip(skip)
          .limit(validPageSize)
          .select('title user wasteLocation wasteType quantity updatedAt')
          .lean()
      : await AdModel.find(filter)
          .skip(skip)
          .limit(validPageSize)
          .sort({ updatedAt: -1 })
          .select('title user wasteLocation wasteType quantity updatedAt')
          .lean()

    return {
      props: {
        status: 'success',
        data: {
          ads: JSON.parse(JSON.stringify(ads)),
          wasteType: wasteTypeNames.includes(wasteType) ? wasteType : '',
          wasteLocation:
            locationDescription && locationId
              ? {
                  description: locationDescription,
                  place_id: locationId,
                }
              : null,
          searchRadius,
          pagination: {
            total: ads.length,
            page: validPage,
            pageSize: validPageSize,
          },
        },
        ...messages,
      },
    }
  } catch (error) {
    return {
      props: {
        status: 'error',
        message: INTERNAL_SERVER_ERROR,
        ...messages,
      },
    }
  }
}
