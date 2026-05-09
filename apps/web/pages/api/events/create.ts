import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'
import { NextApiRequest, NextApiResponse } from 'next'
import { eventValidationSchema } from '../../../lib/validation/eventFormValidator'
import {
  dbConnect,
  WasteRemovalEventModel as EventModel,
} from '@recycl/shared/dist/server/db'
import { apiHandler } from '../../../lib/helpers/errorHelpers'
import { METHOD_NOT_ALLOWED } from '../../../lib/errors'

import mongoose from 'mongoose'
import getCoords from '../../../lib/helpers/getCoords'

async function createEvent(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST')
    return res.status(405).json({ error: METHOD_NOT_ALLOWED })

  const session = await getServerSession(req, res, authOptions)
  if (!session) return res.status(401).end()

  const userId = session.id

  await eventValidationSchema.validate(req.body, {
    abortEarly: false,
  })

  const event = new EventModel(req.body)
  event.user = new mongoose.Types.ObjectId(userId)

  const placeId = event.location.place_id
  const coords = await getCoords(placeId)

  if (!coords || coords.length < 2) {
    throw new Error(`Cannot get coordinates for placeId ${placeId}`)
  }

  event.location.position = {
    type: 'Point',
    coordinates: coords,
  }

  await dbConnect()
  await event.save()

  res.status(200).json({ message: 'Документ успешно создан' })
}

//pass true as a second argument to allow validation errors on frontend
export default apiHandler(createEvent, true)
