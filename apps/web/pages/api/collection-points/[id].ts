import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'
import { NextApiRequest, NextApiResponse } from 'next'
import { collectionPointSchema } from '../../../lib/validation/collectionPointForm'
import {
  dbConnect,
  CollectionPointContainerModel,
  CollectionPointMobileModel,
  CollectionPointStationeryModel,
  CollectionPointModel,
} from '@recycl/shared/dist/server/db'
import { METHOD_NOT_ALLOWED } from '../../../lib/errors'
import { apiHandler } from '../../../lib/helpers/errorHelpers'
import { isValidObjectId } from 'mongoose'
import getCoords from '../../../lib/helpers/getCoords'

async function collectionPointHandler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const session = await getServerSession(req, res, authOptions)
  if (!session) {
    res.status(401).end()
    return
  }
  const { id } = req.query
  if (!isValidObjectId(id)) {
    res.status(404).end()
    return
  }

  switch (req.method) {
    case 'GET':
      await dbConnect()
      const collectionPoint = await CollectionPointModel.findOne({
        _id: id,
        user: session.id,
      }).lean()
      if (!collectionPoint) {
        res.status(404).end()
        return
      }

      res.json(collectionPoint)
      break
    case 'PUT':
      const userId = session.id

      await dbConnect()

      const validated = await collectionPointSchema.validate(req.body, {
        abortEarly: false,
      })

      const existing = await CollectionPointModel.findOne({
        _id: id,
        user: userId,
      })

      if (!existing) {
        return res.status(404).end()
      }

      if (existing.location.place_id !== validated.location.place_id) {
        const placeId = validated.location.place_id
        const coords = await getCoords(placeId)

        if (!coords || coords.length < 2) {
          throw new Error(`Cannot get coordinates for placeId ${placeId}`)
        }

        validated.location['position'] = {
          type: 'Point',
          coordinates: coords,
        }
      } else {
        validated.location['position'] = existing.location.position
      }

      const { variant } = validated
      const data = { _id: id, user: userId }

      variant === 'mobile'
        ? await CollectionPointMobileModel.updateOne(data, validated)
        : variant === 'stationery'
          ? await CollectionPointStationeryModel.updateOne(data, validated)
          : await CollectionPointContainerModel.updateOne(data, validated)

      res.status(200).json({ message: 'Документ обновлен' })
      break

    default:
      res.status(405).json({ error: METHOD_NOT_ALLOWED })
      break
  }
}

export default apiHandler(collectionPointHandler)
