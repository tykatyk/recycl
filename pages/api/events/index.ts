import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'
import { NextApiRequest, NextApiResponse } from 'next'
import { eventValidationSchema } from '../../../lib/validation/eventFormValidator'
import eventQueries from '../../../lib/db/queries/eventQuery'
import eventModel from '../../../lib/db/models/eventModel'
import {
  errorResponse,
  perFormErrorResponse,
} from '../../../lib/helpers/responses'
import dbConnect from '../../../lib/db/connection'
import type { IsInactive } from '../../../lib/types/event'
import mongoose from 'mongoose'

export default async function Events(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  //check if user is authenticated
  const session = await getServerSession(req, res, authOptions)
  if (!session) {
    res.status(401).end()
    return
  }

  const userId = session.id
  await dbConnect()

  //read event
  if (req.method === 'GET') {
    const data = await eventQueries.getAll(req.query, userId)
    res.json(data)
  }
}
