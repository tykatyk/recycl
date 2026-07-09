import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'
import { NextApiRequest, NextApiResponse } from 'next'
import { eventValidationSchema } from '../../../lib/validation/eventFormValidator'
import {
  dbConnect,
  WasteRemovalEventModel as eventModel,
} from '@recycl/shared/dist/server/db'
import { perFormErrorResponse } from '../../../lib/helpers/responses'
import { METHOD_NOT_ALLOWED } from '../../../lib/errors'
import { apiHandler } from '../../../lib/helpers/errorHelpers'

async function updateEvent(req: NextApiRequest, res: NextApiResponse) {
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

    const { id }: { id?: string } = req.query

    await eventValidationSchema.validate(event, {
      abortEarly: false,
    })

    try {
      await eventModel.updateOne({ _id: id, user: userId }, event)
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

export default apiHandler(updateEvent)
