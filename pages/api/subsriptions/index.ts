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
  if (req.method !== 'GET') {
    return res.status(405).json({ error: METHOD_NOT_ALLOWED })
  }

  const session = await getServerSession(req, res, authOptions)

  if (!session?.id) return res.status(401).end()

  await dbConnect()
  const subscriptions = await SubscriptionModel.find({
    user: session.id,
  }).populate('elements')
  return res.json(subscriptions)
}

async function setSubsciptions(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: METHOD_NOT_ALLOWED })
  }
  const session = await getServerSession(req, res, authOptions)

  if (!session?.id) return res.status(401).end()

  await dbConnect()
  const subscriptions = await SubscriptionModel.updateOne(
    {
      user: session.id,
    },
    {
      elements: req.body,
    },
  ).populate('elements')
  return res.json(subscriptions)
}

export default apiHandler(getSubscriptions)
