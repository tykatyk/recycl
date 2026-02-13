import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'
import { NextApiRequest, NextApiResponse } from 'next'
import { Subscription } from '../../../lib/db/models'
import dbConnect from '../../../lib/db/connection'
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

      const subscription = await Subscription.findOne({
        user,
        variant,
      })

      if (subscription) {
        subscription.subscribed = subscribed
        await subscription.save()
        return res.status(200).end()
      }

      const unsubscribeToken = cryptoRandomString({
        length: 32,
        type: 'url-safe',
      })

      const unsubscribeTokenUsed = false
      const today = new Date()

      const unsubscribeTokenExpires = today.getDate() + 30

      const listUnsubscribeToken = cryptoRandomString({
        length: 32,
        type: 'url-safe',
      })
      await Subscription.create({
        user,
        variant,
        subscribed,
        unsubscribeToken,
        unsubscribeTokenUsed,
        unsubscribeTokenExpires,
        listUnsubscribeToken,
      })

      return res.status(200).end()
    }
    case 'GET': {
      const subscriptions = await Subscription.find({
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
