import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../auth/[...nextauth]'
import { NextApiRequest, NextApiResponse } from 'next'
import {
  SubscriptionVariantModel as SubscriptionVariant,
  dbConnect,
} from '@recycl/shared/dist/server/db'
import { apiHandler } from '../../../../lib/helpers/errorHelpers'
import { responseErrrorCodes } from '../../../../lib/helpers/errorHelpers'
const { METHOD_NOT_ALLOWED } = responseErrrorCodes

async function subscriptionVariants(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: METHOD_NOT_ALLOWED })
  }

  const session = await getServerSession(req, res, authOptions)

  if (!session?.id) return res.status(401).end()

  await dbConnect()
  const subscriptionVariants = await SubscriptionVariant.find({})
  return res.json(subscriptionVariants)
}

export default apiHandler(subscriptionVariants)
