import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'
import { NextApiRequest, NextApiResponse } from 'next'
import { eventValidationSchema } from '../../../lib/validation/eventFormValidator'
import eventQueries from '../../../lib/db/queries/eventQuery'
import {
  errorResponse,
  perFormErrorResponse,
} from '../../../lib/helpers/responses'
import dbConnect from '../../../lib/db/connection'

export default async function Events(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const session = await getServerSession(req, res, authOptions)

  if (!session) {
    res.status(401).end()
    return
  }

  if (req.method === 'GET') {
    await dbConnect()

    const userId = session?.id
    const data = await eventQueries.getAll(req.query, userId)
    res.json(data)
  }

  if (req.method === 'POST') {
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
      await eventQueries.create(req.body, {
        _id: session.id,
      })
    } catch (e) {
      perFormErrorResponse('Ошибка при создании документа', res)
      return
    }

    res.status(200).json({ message: 'Документ успешно создан' })
  }

  if (req.method === 'PUT') {
    await dbConnect()
    const event = req.body
    //ToDo check if user has right to update events
    try {
      await eventValidationSchema.validate(event, {
        abortEarly: false,
      })
    } catch (error) {
      console.log(error)
      return errorResponse(error, res)
    }

    try {
      await eventQueries.update(event)
    } catch (e) {
      console.log('here')
      perFormErrorResponse('Ошибка при обновлении документа', res)
      return
    }

    res.status(200).json({ message: 'Документ обновлен' })
  }
  if (req.method === 'DELETE') {
  }
}
