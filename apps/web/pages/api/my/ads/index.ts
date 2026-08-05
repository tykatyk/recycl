import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../auth/[...nextauth]'
import { NextApiRequest, NextApiResponse } from 'next'
import { AdModel, dbConnect } from '@recycl/shared/dist/server/db'
import * as yup from 'yup'
import {
  validOrderBy,
  validSortOrder,
} from '../../../../lib/helpers/eventHelpers' //ToDo: rename and refactor eventHelpers
import { apiHandler } from '../../../../lib/helpers/errorHelpers'
import { METHOD_NOT_ALLOWED } from '../../../../lib/errors'
import { SortOrder, OrderBy } from '../../../../lib/types/pagination'
import {
  paginationPageNumberSchema,
  paginationPageSizeSchema,
  adSchema,
} from '../../../../lib/validation'
import mongoose from 'mongoose'
import getCoords from '../../../../lib/helpers/getCoords'
import { documentActivityStatus } from '@recycl/shared/dist/constants'

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

    default:
      return res.status(405).json({ error: METHOD_NOT_ALLOWED })
  }
}

export default apiHandler(adsHanlder)
