import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'
import { NextApiRequest, NextApiResponse } from 'next'
import { SubscriptionModel, dbConnect } from '@recycl/shared/dist/server/db/'
import { subscriptionVariantNames } from '@recycl/shared/dist/server/subscription/'
import { apiHandler } from '../../../lib/helpers/errorHelpers'
import cryptoRandomString from 'crypto-random-string'
import * as yup from 'yup'

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
      // const validationSchema = yup.object({
      //   variant: yup.string().oneOf(Object.keys(subscriptionVariantNames)),
      //   subscribed: yup.string().oneOf(['true', 'false']),
      // })
      // try {
      //   await validationSchema.validate(req.query)
      // } catch (error) {
      //   console.error(error)
      // }

      const subscriptions = await SubscriptionModel.find({
        user: session.id,
        subscribed: true,
      }).lean()

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
