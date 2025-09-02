import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'
import { NextApiRequest, NextApiResponse } from 'next'
import { eventValidationSchema } from '../../../lib/validation/eventFormValidator'
import EventModel from '../../../lib/db/models/eventModel'
import {
  apiHandler,
  METHOD_NOT_ALLOWED,
} from '../../../lib/helpers/errorHelpers'
import dbConnect from '../../../lib/db/connection'
import mongoose from 'mongoose'

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

  await dbConnect()
  await event.save()

  res.status(200).json({ message: 'Документ успешно создан' })
}

//pass true as a second argument to allow validation errors on frontend
export default apiHandler(createEvent, true)
