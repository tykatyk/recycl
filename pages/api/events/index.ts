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

  //create event
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
        _id: userId,
      })
    } catch (e) {
      perFormErrorResponse('Ошибка при создании документа', res)
      return
    }

    res.status(200).json({ message: 'Документ успешно создан' })
  }

  //update event
  if (req.method === 'PUT') {
    const event = req.body
    const { isInactive }: IsInactive = req.query
    const { _id: eventId, ...eventRest } = event

    try {
      await eventValidationSchema.validate(event, {
        abortEarly: false,
      })
    } catch (error) {
      console.log(error)
      return errorResponse(error, res)
    }

    if (isInactive) eventRest.isActive = false

    try {
      await eventModel.updateOne(
        { _id: eventId, user: new mongoose.Types.ObjectId(userId) },
        eventRest,
      )
    } catch (e) {
      console.log(e)
      perFormErrorResponse('Ошибка при обновлении документа', res)
      return
    }

    res.status(200).json({ message: 'Документ обновлен' })
  }

  //delete event
  if (req.method === 'DELETE') {
    const eventId = req.query

    try {
      await eventModel.deleteOne({ user: userId, _id: eventId })
    } catch (e) {
      res.status(500).json({ error: 'An error occurred while deleting event' })
      return
    }
    res.status(200).json({ message: 'Документ удален' })
  }
}
