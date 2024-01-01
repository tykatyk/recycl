import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'
import { NextApiRequest, NextApiResponse } from 'next'
import { eventValidationSchema } from '../../../lib/validation/eventFormValidator'
import eventModel from '../../../lib/db/models/eventModel'
import {
  errorResponse,
  perFormErrorResponse,
} from '../../../lib/helpers/responses'
import dbConnect from '../../../lib/db/connection'
import type { IsInactive } from '../../../lib/types/event'

export default async function UpdateEvent(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'PUT') {
    //check if user is authenticated
    const session = await getServerSession(req, res, authOptions)
    if (!session) {
      res.status(401).end()
      return
    }

    const userId = session.id

    await dbConnect()

    const event = req.body

    type UpdateEventQuery = { id?: string } & Pick<IsInactive, 'isInactive'>

    const { isInactive, id }: UpdateEventQuery = req.query

    try {
      await eventValidationSchema.validate(event, {
        abortEarly: false,
      })
    } catch (error) {
      console.log(error)
      return errorResponse(error, res)
    }

    if (isInactive) event.isActive = false

    try {
      await eventModel.updateOne({ _id: id, user: userId }, event)
    } catch (e) {
      console.log(e)
      perFormErrorResponse('Ошибка при обновлении документа', res)
      return
    }

    res.status(200).json({ message: 'Документ обновлен' })
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
}
