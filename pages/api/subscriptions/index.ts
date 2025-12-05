import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'
import { NextApiRequest, NextApiResponse } from 'next'
import SubscriptionModel from '../../../lib/db/models/subscription'
import dbConnect from '../../../lib/db/connection'
import { apiHandler } from '../../../lib/helpers/errorHelpers'

async function mySubscriptions(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)

  if (!session?.id) return res.status(401).end()

  await dbConnect()

  if (req.method === 'GET') {
    const subscriptions = await SubscriptionModel.findOne({
      user: session.id,
    })

    return res.json(subscriptions?.elements || [])
  }

  if (req.method === 'POST') {
    const updated = await SubscriptionModel.updateOne(
      {
        user: session.id,
      },
      {
        elements: req.body.updatedSubs,
      },
      {
        upsert: true,
      },
    )
    return res.json(updated)
  }
}

export default apiHandler(mySubscriptions)
