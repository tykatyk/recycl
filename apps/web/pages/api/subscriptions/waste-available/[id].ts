import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../../api/auth/[...nextauth]'
import { NextApiRequest, NextApiResponse } from 'next'
import {
  WasteAvailableSubscriptionModel,
  dbConnect,
} from '@recycl/shared/dist/server/db/'
import { apiHandler } from '../../../../lib/helpers/errorHelpers'

async function singleWasteAvailableSubscriptionApiHandler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const session = await getServerSession(req, res, authOptions)

  if (!session?.id) return res.status(401).end()

  await dbConnect()

  switch (req.method) {
    case 'GET': {
      const { id } = req.query
      const subscription =
        await WasteAvailableSubscriptionModel.findById(id).lean()
      console.log(subscription)
      return res.json(subscription)
    }

    default: {
      return res.status(405).end()
    }
  }
}

export default apiHandler(singleWasteAvailableSubscriptionApiHandler, true)
