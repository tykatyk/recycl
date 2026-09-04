import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../auth/[...nextauth]'
import { NextApiRequest, NextApiResponse } from 'next'
import { AdModel, dbConnect } from '@recycl/shared/dist/server/db'
import * as yup from 'yup'
import {
  validOrderBy,
  validSortOrder,
} from '../../../../lib/helpers/eventHelpers' //ToDo: rename and refactor eventHelpers
import { apiHandler } from '../../../../lib/helpers/responses'
import {
  responseErrorCodes,
  responseStatuses,
} from '../../../../lib/helpers/responses'
import { SortOrder, OrderBy } from '../../../../lib/types/pagination'
import {
  paginationPageNumberSchema,
  paginationPageSizeSchema,
  adSchema,
} from '../../../../lib/validation'
import mongoose from 'mongoose'
import getCoords from '../../../../lib/helpers/getCoords'
import {
  AD_EXPIRATION_PERIOD,
  documentActivityStatus,
} from '@recycl/shared/dist/constants'

const { SUCCESS, ERROR } = responseStatuses
const { METHOD_NOT_ALLOWED, VALIDATION_ERROR } = responseErrorCodes
const { active, blocked } = documentActivityStatus

const queryValidationSchema = yup.object({
  page: paginationPageNumberSchema,
  pageSize: paginationPageSizeSchema,
  sortOrder: yup
    .string<SortOrder>()
    .transform((value) => (validSortOrder[value] ? value : undefined))
    .default(validSortOrder.desc),
  sortProperty: yup
    .string<OrderBy>()
    .transform((value) => (validOrderBy[value] ? value : undefined))
    .default(validOrderBy.createdAt),
  variant: yup
    .string<keyof typeof documentActivityStatus>()
    .transform((value) =>
      Object.keys(documentActivityStatus).includes(value) ? value : undefined,
    )
    .default('active'),
})

async function adsHanlder(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)
  if (!session?.id) return res.status(401).end()

  const user = session.id

  switch (req.method) {
    case 'POST': {
      const validated = await adSchema.validate(req.body, {
        abortEarly: false,
      })

      const data = {
        ...validated,
        user: new mongoose.Types.ObjectId(user),
      }

      const ad = new AdModel(data)

      if (!ad) return res.status(400).end()

      const placeId = ad.wasteLocation.place_id
      const coords = await getCoords(placeId)

      if (!coords || coords.length < 2) {
        throw new Error(`Cannot get coordinates for placeId ${placeId}`)
      }

      ad.wasteLocation.position = {
        type: 'Point',
        coordinates: coords,
      }

      await dbConnect()
      await ad.save()

      res.status(200).json({ message: 'Документ успешно создан' })
      break
    }

    case 'GET': {
      const validatedQuery = await queryValidationSchema.validate(req.query, {
        stripUnknown: true,
      })

      const { page, pageSize, variant, sortOrder, sortProperty } =
        validatedQuery

      await dbConnect()
      const now = Date.now()

      const query = {
        user,
        ...(variant === 'active'
          ? {
              status: 'active',
              expires: {
                $gte: now,
              },
            }
          : {
              $or: [
                { status: 'disabled' },
                {
                  expires: {
                    $lt: now,
                  },
                },
              ],
            }),
      }

      const total = await AdModel.countDocuments(query)

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

      const data = await AdModel.find(query)
        .skip(skip)
        .limit(pageSize)
        .sort({ updatedAt: -1 })
        .lean()

      res.json({
        items: data,
        pagination: {
          page,
          pageSize,
          total,
        },
      })

      break
    }
    case 'DELETE': {
      await dbConnect()

      const { documentIds }: { documentIds: string[] } = req.body

      if (!Array.isArray(documentIds) || !(documentIds.length > 0)) {
        res
          .status(400)
          .json({ error: `Expected an array of ids but got ${documentIds}` })
        return
      }
      let deletedCount = 0
      try {
        const result = await AdModel.deleteMany({
          user: session.id,
          _id: { $in: documentIds },
        })
        deletedCount = result.deletedCount
        console.log(`${deletedCount} ads successfully deleted`)
      } catch (e) {
        console.log(e)
        res.status(500).json({ error: 'An error occurred while deleting ads' })
        return
      }

      res
        .status(200)
        .json({ message: `${deletedCount} ads successfully deleted` })
      break
    }

    case 'PATCH': {
      const {
        action,
        ids,
      }: { action: 'activate' | 'deactivate'; ids: string[] } = req.body

      if (action !== 'activate' && action !== 'deactivate') {
        return res.status(400).json({
          status: ERROR,
          error: {
            code: VALIDATION_ERROR,
            message: 'Unknown action',
          },
        })
      }

      const allAreValid = ids.every((id) => mongoose.Types.ObjectId.isValid(id))

      if (!allAreValid) {
        return res.status(400).json({
          status: ERROR,
          error: {
            code: VALIDATION_ERROR,
            message: 'Some ids are invalid',
          },
        })
      }

      const updated =
        action === 'activate'
          ? {
              status: active,
              expires: new Date(
                Date.now() + AD_EXPIRATION_PERIOD * 24 * 60 * 60 * 1000,
              ),
            }
          : { status: 'disabled' }

      await dbConnect()
      const result = await AdModel.updateMany(
        {
          _id: { $in: ids },
          user: new mongoose.Types.ObjectId(user),
          status: { $ne: blocked },
        },
        {
          $set: updated,
        },
      )

      if (!result) return res.status(400).end()

      res.status(200).json({
        status: SUCCESS,
        message: `Documents modified: ${result.modifiedCount}`,
      })
      break
    }

    default:
      return res.status(405).json({ error: METHOD_NOT_ALLOWED })
  }
}

export default apiHandler(adsHanlder)
