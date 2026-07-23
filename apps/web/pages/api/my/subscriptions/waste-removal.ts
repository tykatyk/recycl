import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../../api/auth/[...nextauth]'
import { NextApiRequest, NextApiResponse } from 'next'
import {
  WasteRemovalSubscriptionModel,
  dbConnect,
} from '@recycl/shared/dist/server/db'
import { apiHandler } from '../../../../lib/helpers/errorHelpers'
import { wasteRemovalSubscriptionSchema } from '../../../../lib/validation'

async function wasteRemovalSubscriptionApiHandler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const session = await getServerSession(req, res, authOptions)

  if (!session?.id) return res.status(401).end()

  await dbConnect()

  switch (req.method) {
    case 'GET': {
      console.log(session.id)
      const subscription = await WasteRemovalSubscriptionModel.findOne({
        user: session.id,
      })
        .select('-_id radius')
        .lean()

      return res.json(subscription)
    }

    case 'POST': {
      await wasteRemovalSubscriptionSchema.validate(req.body, {
        abortEarly: false,
      })

      const { radius } = req.body

      await WasteRemovalSubscriptionModel.findOneAndUpdate(
        { user: session.id },
        { radius },
        { upsert: true },
      )

      return res.status(200).end()
    }

    default: {
      return res.status(405).end()
    }
  }
}

export default apiHandler(wasteRemovalSubscriptionApiHandler, true)
