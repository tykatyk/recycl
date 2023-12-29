import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'
import { NextApiRequest, NextApiResponse } from 'next'
import eventModel from '../../../lib/db/models/eventModel'
import dbConnect from '../../../lib/db/connection'

export default async function EventMassDeactivation(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const session = await getServerSession(req, res, authOptions)

  if (!session) {
    res.status(401).end()
    return
  }

  if (req.method === 'POST') {
    await dbConnect()

    const { eventIds }: { eventIds: string[] } = req.body

    if (!Array.isArray(eventIds) || eventIds.length < 1) {
      res
        .status(400)
        .json({ error: `Expected an array of ids but got ${eventIds}` })
      return
    }

    try {
      await eventModel.updateMany(
        { user: session.id, _id: { $in: eventIds } },
        { isActive: false },
      )
    } catch (e) {
      console.log(e)
      res
        .status(500)
        .json({ error: 'An error occurred while inactivating ads' })
      return
    }

    res.status(200).json({ message: 'Ads successfully deactivated' })
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
}
