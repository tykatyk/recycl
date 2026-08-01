import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../auth/[...nextauth]'
import { NextApiRequest, NextApiResponse } from 'next'
import collectionPointsQueries from '../../../../lib/helpers/queries/collectionPointQueries'
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
} from '../../../../lib/validation'
import mongoose from 'mongoose'
import getCoords from '../../../../lib/helpers/getCoords'
import {
  collectionPointTypes,
  documentActivityStatus,
} from '@recycl/shared/dist/constants'

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
    case 'GET':
      const validatedQuery = await queryValidationSchema.validate(req.query, {
        stripUnknown: true,
      })

      const { page, pageSize, variant, sortOrder, sortProperty } =
        validatedQuery

      await dbConnect()

      const total = await AdModel.countDocuments({
        status: variant,
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

      //   const ads = await collectionPointsQueries.getAll(validatedQuery, userId)

      const data = await AdModel.find({ user })
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

      break

    default:
      return res.status(405).json({ error: METHOD_NOT_ALLOWED })
  }
}

export default apiHandler(adsHanlder)
