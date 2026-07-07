import { NextApiRequest, NextApiResponse } from 'next'
import * as yup from 'yup'
import { apiHandler } from '../../../lib/helpers/errorHelpers'
import { METHOD_NOT_ALLOWED } from '../../../lib/errors'
import { getClusters } from '../../../lib/helpers/clusterMaker'
import type { BBox } from '@recycl/shared/dist/server/types'
import {
  dbConnect,
  RemovalApplicationModel,
} from '@recycl/shared/dist/server/db'
import { adSearchFormSchema } from '../../../lib/validation'
import { InferType } from 'yup'

async function adsListHandler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: METHOD_NOT_ALLOWED })
  }

  await adSearchFormSchema.validate(req.query, {
    stripUnknown: true,
  })

  const {
    searchRadius,
    searchType,
    wasteLocation,
    wasteType,
    page = 1,
    limit = 20,
  } = req.query as InferType<typeof adSearchFormSchema>

  const dbQuery = {
    status: 'active',
  }
  let ads = []

  await dbConnect()

  if (wasteType) {
    dbQuery['wasteType'] = wasteType
  }

  if (wasteLocation) {
    if (searchType === 'radius' && searchRadius) {
      const firstAd = await RemovalApplicationModel.findOne({
        'wasteLocation.place_id': wasteLocation,
      })

      if (!firstAd) {
        console.log('No ads found')
        return res.json({ ads: [] })
      }
      dbQuery['wasteLocation']['position'] = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: firstAd.wasteLocation.position,
          },
          $maxDistance: searchRadius * 1000, // Distance in meters
        },
      }
      dbQuery['searchRadius'] = searchRadius
    } else {
      dbQuery['wasteLocation'] = {
        place_id: wasteLocation,
      }
    }
    ads = await RemovalApplicationModel.find(dbQuery)
      .skip(Math.max(page - 1, 0) * limit)
      .limit(limit)
  } else {
    // console.log(dbQuery)
    ads = await RemovalApplicationModel.find(dbQuery)
      .skip(Math.max(page - 1, 0) * limit)
      .sort({ updated_at: 1 })
  }

  return res.json({ ads })
}
export default apiHandler(adsListHandler)
