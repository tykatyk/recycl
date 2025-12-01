import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'
import { NextApiRequest, NextApiResponse } from 'next'
import SubscriptionModel, {
  wasteRemovalSubscription,
} from '../../../lib/db/models/subscription'
import dbConnect from '../../../lib/db/connection'
import {
  apiHandler,
  METHOD_NOT_ALLOWED,
} from '../../../lib/helpers/errorHelpers'

async function getSubscriptions(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)

  if (!session?.id) return res.status(401).end()

  await dbConnect()

  if (req.method === 'GET') {
    const subscriptions = await SubscriptionModel.find({
      user: session.id,
    }).populate('elements')
    return res.json(subscriptions)
  }

  if (req.method === 'POST') {
    console.log(req.body)
    const updated = await SubscriptionModel.updateOne(
      {
        user: session.id,
      },
      {
        elements: req.body.userSubs,
      },
      {
        upsert: true,
      },
    )
    return res.json(updated)
  }
}

export default apiHandler(getSubscriptions)
