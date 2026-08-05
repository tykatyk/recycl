import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../auth/[...nextauth]'
import { NextApiRequest, NextApiResponse } from 'next'
import { adSchema } from '../../../../lib/validation'
import { dbConnect, AdModel } from '@recycl/shared/dist/server/db'
import { METHOD_NOT_ALLOWED } from '../../../../lib/errors'
import { apiHandler } from '../../../../lib/helpers/errorHelpers'
import { isValidObjectId } from 'mongoose'
import getCoords from '../../../../lib/helpers/getCoords'
import { AD_EXPIRATION_PERIOD } from '@recycl/shared/dist/constants'

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
  const existing = await AdModel.findOne({ _id: id, user }).lean()
  if (!existing) {
    return res.status(404).end()
  }

  switch (req.method) {
    case 'GET':
      res.json(existing)
      break
    case 'PUT':
      const validated = await adSchema.validate(req.body, {
        abortEarly: false,
      })

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
    case 'PATCH':
      const { action } = req.body

      if (action !== 'activate' && action !== 'deactivate') {
        return res.status(400).end()
      }

      if (existing.status === 'blocked') {
        return res.status(403).end()
      }
      const updated =
        action === 'activate'
          ? {
              status: 'active',
              expires: new Date(
                Date.now() + AD_EXPIRATION_PERIOD * 24 * 60 * 60 * 1000,
              ),
            }
          : { status: 'disabled' }

      await AdModel.updateOne(existing, updated)
      res.status(200).end()
      break
    default:
      res.status(405).json({ error: METHOD_NOT_ALLOWED })
      break
  }
}

export default apiHandler(adHandler)
