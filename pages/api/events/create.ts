import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'
import { NextApiRequest, NextApiResponse } from 'next'
import { eventValidationSchema } from '../../../lib/validation/eventFormValidator'
import EventModel from '../../../lib/db/models/eventModel'
import {
  errorResponse,
  perFormErrorResponse,
} from '../../../lib/helpers/responses'
import dbConnect from '../../../lib/db/connection'

export default async function Events(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'POST') {
    //check if user is authenticated
    const session = await getServerSession(req, res, authOptions)
    if (!session) {
      res.status(401).end()
      return
    }

    const userId = session.id
    await dbConnect()

    try {
      await eventValidationSchema.validate(req.body, {
        abortEarly: false,
      })
    } catch (error) {
      console.log(error)
      return errorResponse(error, res)
    }

    try {
      const event = new EventModel(req.body)
      event.user = userId

      await event.save()
    } catch (e) {
      perFormErrorResponse('Ошибка при создании документа', res)
      return
    }

    res.status(200).json({ message: 'Документ успешно создан' })
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
}
