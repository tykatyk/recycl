import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../auth/[...nextauth]'
import { NextApiRequest, NextApiResponse } from 'next'
import { adSchema } from '../../../../lib/validation'
import {
  dbConnect,
  CollectionPointContainerModel,
  CollectionPointMobileModel,
  CollectionPointStationeryModel,
  CollectionPointModel,
  AdModel,
} from '@recycl/shared/dist/server/db'
import { METHOD_NOT_ALLOWED } from '../../../../lib/errors'
import { apiHandler } from '../../../../lib/helpers/errorHelpers'
import { isValidObjectId } from 'mongoose'
import getCoords from '../../../../lib/helpers/getCoords'

async function adHandler(req: NextApiRequest, res: NextApiResponse) {
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

  const user = session.id
  await dbConnect()

  switch (req.method) {
    case 'GET':
      const ad = await AdModel.findOne({
        _id: id,
        user,
      }).lean()
      if (!ad) {
        res.status(404).end()
        return
      }

      res.json(ad)
      break
    case 'PUT':
      const validated = await adSchema.validate(req.body, {
        abortEarly: false,
      })

      const existing = await AdModel.findOne({
        _id: id,
        user,
      })

      if (!existing) {
        return res.status(404).end()
      }

      if (
        existing.wasteLocation.place_id !== validated.wasteLocation.place_id
      ) {
        const placeId = validated.wasteLocation.place_id
        const coords = await getCoords(placeId)

        if (!coords || coords.length < 2) {
          throw new Error(`Cannot get coordinates for placeId ${placeId}`)
        }

        validated.wasteLocation['position'] = {
          type: 'Point',
          coordinates: coords,
        }
      } else {
        validated.wasteLocation['position'] = existing.wasteLocation.position
      }

      const data = { _id: id, user }

      await AdModel.updateOne(data, validated)

      res.status(200).json({ message: 'Документ обновлен' })
      break

    default:
      res.status(405).json({ error: METHOD_NOT_ALLOWED })
      break
  }
}

export default apiHandler(adHandler)
