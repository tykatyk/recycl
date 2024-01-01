import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'
import { NextApiRequest, NextApiResponse } from 'next'
import eventModel from '../../../lib/db/models/eventModel'
import dbConnect from '../../../lib/db/connection'

export default async function EventMassDeletion(
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

    if (!Array.isArray(eventIds) || !(eventIds.length > 0)) {
      res
        .status(400)
        .json({ error: `Expected an array of ids but got ${eventIds}` })
      return
    }
    let deletedCount = 0
    try {
      const result = await eventModel.deleteMany({
        user: session.id,
        _id: { $in: eventIds },
      })
      deletedCount = result.deletedCount
      console.log(`${deletedCount} ads successfully deleted`)
    } catch (e) {
      console.log(e)
      res.status(500).json({ error: 'An error occurred while deleting ads' })
      return
    }

    res
      .status(200)
      .json({ message: `${deletedCount} ads successfully deleted` })
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
}
