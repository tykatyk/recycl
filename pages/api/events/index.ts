import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'
import { NextApiRequest, NextApiResponse } from 'next'
import { eventValidationSchema } from '../../../lib/validation/eventForm'
import eventQueries from '../../../lib/db/queries/event'
import {
  errorResponse,
  perFormErrorResponse,
} from '../../../lib/helpers/responses'

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
  }

  if (req.method === 'POST') {
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
        name: session.user?.name,
      })
    } catch (e) {
      perFormErrorResponse('Ошибка при создании документа', res)
      return
    }

    res.status(200).json({ message: 'Документ успешно создан' })
  }
  if (req.method === 'PUT') {
  }
  if (req.method === 'DELETE') {
  }
}
