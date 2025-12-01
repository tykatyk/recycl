import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'
import { NextApiRequest, NextApiResponse } from 'next'
import SubscriptionVariant from '../../../lib/db/models/subscriptionVariant'
import dbConnect from '../../../lib/db/connection'
import {
  apiHandler,
  METHOD_NOT_ALLOWED,
} from '../../../lib/helpers/errorHelpers'

async function getSubscriptionVariants(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: METHOD_NOT_ALLOWED })
  }

  const session = await getServerSession(req, res, authOptions)

  if (!session?.id) return res.status(401).end()

  await dbConnect()
  const subscriptionVariants = await SubscriptionVariant.find({})
  return res.json(subscriptionVariants)
}

export default apiHandler(getSubscriptionVariants)
