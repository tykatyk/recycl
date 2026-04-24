import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'
import { NextApiRequest, NextApiResponse } from 'next'
import { SubscriptionModel, dbConnect } from '@recycl/shared/dist/server/db/'
import { apiHandler } from '../../../lib/helpers/errorHelpers'
import cryptoRandomString from 'crypto-random-string'

async function mySubscriptions(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)

  if (!session?.id) return res.status(401).end()

  await dbConnect()

  switch (req.method) {
    case 'POST': {
      //ToDo: handle errors
      const { variant, subscribed } = req.body

      if (!variant && typeof subscribed !== 'boolean') {
        return res.status(400).end()
      }

      const user = session.id

      const subscription = await SubscriptionModel.findOne({
        user,
        variant,
      })

      if (subscription) {
        subscription.subscribed = subscribed
        await subscription.save()
        return res.status(200).end()
      }

      const listUnsubscribeToken = cryptoRandomString({
        length: 32,
        type: 'url-safe',
      })
      await SubscriptionModel.create({
        user,
        variant,
        subscribed,
        listUnsubscribeToken,
      })

      return res.status(200).end()
    }
    case 'GET': {
      const subscriptions = await SubscriptionModel.find({
        user: session.id,
        subscribed: true,
      })
        .select('-_id variant')
        .lean()

      if (!subscriptions) return res.json([])

      const variantIds = subscriptions.map((sub) => sub.variant)

      return res.json(variantIds)
    }

    default: {
      return res.status(405).end()
    }
  }
}

export default apiHandler(mySubscriptions)
