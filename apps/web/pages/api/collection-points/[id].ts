import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'
import { NextApiRequest, NextApiResponse } from 'next'
import { collectionPointSchema } from '../../../lib/validation/collectionPointForm'
import {
  dbConnect,
  CollectionPointContainerModel,
} from '@recycl/shared/dist/server/db'
import { perFormErrorResponse } from '../../../lib/helpers/responses'
import { METHOD_NOT_ALLOWED } from '../../../lib/errors'
import { apiHandler } from '../../../lib/helpers/errorHelpers'
import { isValidObjectId } from 'mongoose'
import getCoords from '../../../lib/helpers/getCoords'

async function collectionPointHandler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'GET') {
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

    await dbConnect()
    const collectionPoint = await CollectionPointContainerModel.findOne({
      _id: id,
      user: session.id,
    }).lean()
    if (!collectionPoint) {
      res.status(404).end()
      return
    }

    res.json(collectionPoint)
  }

  if (req.method === 'PUT') {
    const session = await getServerSession(req, res, authOptions)
    if (!session) {
      res.status(401).end()
      return
    }

    const userId = session.id

    await dbConnect()

    const collectionPoint = req.body
    await collectionPointSchema.validate(event, {
      abortEarly: false,
    })

    const { id }: { id?: string } = req.query

    const existing = await CollectionPointContainerModel.findOne({
      _id: id,
      user: userId,
    })

    if (!existing) {
      return res.status(404).end()
    }

    if (existing.location.place_id !== collectionPoint.location.place_id) {
      const placeId = collectionPoint.location.place_id
      const coords = await getCoords(placeId)

      if (!coords || coords.length < 2) {
        throw new Error(`Cannot get coordinates for placeId ${placeId}`)
      }

      collectionPoint.location.position = {
        type: 'Point',
        coordinates: coords,
      }
    } else {
      collectionPoint.location.position = existing.location.position
    }

    try {
      await CollectionPointContainerModel.updateOne(
        { _id: id, user: userId },
        event,
      )
    } catch (e) {
      console.log(e)
      perFormErrorResponse('Ошибка при обновлении документа', res)
      return
    }

    res.status(200).json({ message: 'Документ обновлен' })
  } else {
    res.status(405).json({ error: METHOD_NOT_ALLOWED })
  }
}

export default apiHandler(collectionPointHandler)
