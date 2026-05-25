import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../auth/[...nextauth]'
import { NextApiRequest, NextApiResponse } from 'next'
import {
  WasteAvailableSubscriptionModel,
  dbConnect,
} from '@recycl/shared/dist/server/db/'
import { apiHandler } from '../../../../lib/helpers/errorHelpers'
import getCoords from '../../../../lib/helpers/getCoords'
import {
  wasteAvailableSubscriptionSchema,
  paginationPageNumberSchema,
  paginationPageSizeSchema,
} from '../../../../lib/validation'
import { Types } from 'mongoose'
import * as yup from 'yup'

async function wasteAvailableSubscriptionApiHandler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const session = await getServerSession(req, res, authOptions)

  if (!session?.id) return res.status(401).end()
  const user = session.id

  await dbConnect()

  switch (req.method) {
    case 'POST': {
      await wasteAvailableSubscriptionSchema.validate(req.body, {
        abortEarly: false,
      })

      const { location, wasteTypes, radius } = req.body
      const coords = await getCoords(location.place_id)
      if (!coords) {
        throw new Error('Cannot retrieve coordinates')
      }

      await WasteAvailableSubscriptionModel.create({
        user,
        location: {
          position: { type: 'Point', coordinates: coords },
          ...location,
        },
        wasteTypes,
        radius,
      })

      return res.status(200).end()
    }

    case 'GET': {
      const queryValidationSchema = yup.object({
        page: paginationPageNumberSchema,
        pageSize: paginationPageSizeSchema,
      })

      const validatedQuery = await queryValidationSchema.validate(req.query, {
        stripUnknown: true,
      })

      const { page, pageSize } = validatedQuery

      const total = await WasteAvailableSubscriptionModel.countDocuments({
        user,
      })
      const skip = Math.max(page - 1, 0) * pageSize

      if (skip >= total) {
        return res.json({
          items: [],
          pagination: {
            page,
            pageSize,
            total,
          },
        })
      }

      const data = await WasteAvailableSubscriptionModel.find({ user })
        .skip(skip)
        .limit(pageSize)
        .sort({ _id: -1 })
        .lean()

      res.json({
        items: data,
        pagination: {
          page,
          pageSize,
          total,
        },
      })
    }

    case 'DELETE': {
      const { documentId } = req.body
      if (!Types.ObjectId.isValid(documentId)) return res.status(400)

      const data =
        await WasteAvailableSubscriptionModel.findByIdAndDelete(documentId)
      if (!data) return res.status(404).end()
      return res.status(204).end()
    }

    default: {
      return res.status(405).end()
    }
  }
}

export default apiHandler(wasteAvailableSubscriptionApiHandler, true)
