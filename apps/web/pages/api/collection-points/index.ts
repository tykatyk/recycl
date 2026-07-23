import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'
import { NextApiRequest, NextApiResponse } from 'next'
import collectionPointsQueries from '../../../lib/helpers/queries/collectionPointQueries'
import {
  CollectionPointContainerModel,
  CollectionPointMobileModel,
  CollectionPointModel,
  CollectionPointStationeryModel,
  dbConnect,
} from '@recycl/shared/dist/server/db'
import * as yup from 'yup'
import { validOrderBy, validSortOrder } from '../../../lib/helpers/eventHelpers'
import { apiHandler } from '../../../lib/helpers/errorHelpers'
import { METHOD_NOT_ALLOWED } from '../../../lib/errors'
import { SortOrder, OrderBy } from '../../../lib/types/pagination'
import {
  collectionPointSchema,
  paginationPageNumberSchema,
  paginationPageSizeSchema,
} from '../../../lib/validation'
import mongoose from 'mongoose'
import getCoords from '../../../lib/helpers/getCoords'
import { collectionPointTypes } from '@recycl/shared/dist/constants'

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
    .string<keyof typeof collectionPointTypes>()
    .transform((value) =>
      Object.keys(collectionPointTypes).includes(value) ? value : undefined,
    )
    .default('container'),
})

async function collectionPointsHanlder(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const session = await getServerSession(req, res, authOptions)
  if (!session?.id) return res.status(401).end()

  const userId = session.id

  switch (req.method) {
    case 'POST':
      const validated = await collectionPointSchema.validate(req.body, {
        abortEarly: false,
      })

      const { variant } = validated
      const data = {
        ...validated,
        user: new mongoose.Types.ObjectId(userId),
      }

      const collectionPoint =
        variant === 'mobile'
          ? new CollectionPointMobileModel(data)
          : variant === 'stationery'
            ? new CollectionPointStationeryModel(data)
            : new CollectionPointContainerModel(data)

      if (!collectionPoint) return res.status(400).end()

      const placeId = collectionPoint.location.place_id
      const coords = await getCoords(placeId)

      if (!coords || coords.length < 2) {
        throw new Error(`Cannot get coordinates for placeId ${placeId}`)
      }

      collectionPoint.location.position = {
        type: 'Point',
        coordinates: coords,
      }

      await dbConnect()
      await collectionPoint.save()

      res.status(200).json({ message: 'Документ успешно создан' })
      break
    case 'GET':
      let validatedQuery = await queryValidationSchema.validate(req.query, {
        stripUnknown: true,
      })

      await dbConnect()
      const collectionPoints = await collectionPointsQueries.getAll(
        validatedQuery,
        userId,
      )

      const total = await CollectionPointModel.countDocuments({
        variant: validatedQuery.variant,
        user: userId,
      })

      const pagination = {
        total,
        page: validatedQuery.page,
        pageSize: validatedQuery.pageSize,
      }
      res.json({ items: collectionPoints, pagination })
      break
    case 'DELETE':
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
        const result = await CollectionPointModel.deleteMany({
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
    default:
      return res.status(405).json({ error: METHOD_NOT_ALLOWED })
  }
}

export default apiHandler(collectionPointsHanlder)
