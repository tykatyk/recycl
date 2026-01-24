import { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '../../../lib/db/connection'
import { User, Subscription } from '../../../lib/db/models'
const USER_NOT_FOUND = 'USER_NOT_FOUND'
const SUBSCRIPTION_NOT_FOUND = 'SUBSCRIPTION_NOT_FOUND'
const TOKEN_NOT_FOUND = 'TOKEN_NOT_FOUND'
const TOKEN_EXPIRED = 'TOKEN_EXPIRED'
const TOKEN_USED = 'TOKEN_USED'
const OK = 'OK'

export default async function unsubscribe(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  switch (req.method) {
    case 'POST': {
      const { email } = req.body
      if (typeof email !== 'string') {
        return res.status(400).end()
      }
      await dbConnect()
      const user = await User.findOne({ email }).select('_id').lean()
      if (!user) {
        return res.status(200).json({ message: USER_NOT_FOUND })
      }
      const subscription = await Subscription.findOne({ user: user._id })
      if (!subscription) {
        return res.status(200).json({ message: SUBSCRIPTION_NOT_FOUND })
      }

      return res.json({ message: 'ok' })
    }
    case 'GET': {
      const { token } = req.query
      if (typeof token !== 'string') {
        return res.status(400).end()
      }
      try {
        await dbConnect()
        const subscriptions = await Subscription.findOne({
          elements: { unsubscribeToken: token },
        }).select(['unsubscribeTokenUsed', 'unsubscribeTokenExpires'])

        if (!subscriptions) {
          return res.status(200).json({ message: TOKEN_NOT_FOUND })
        }
        const element = subscriptions.elements.find(
          (el) => el.unsubscribeToken === token,
        )

        if (!element) {
          return res.status(200).json({ message: TOKEN_NOT_FOUND })
        }

        const { unsubscribeTokenUsed, unsubscribeTokenExpires } = element

        if (unsubscribeTokenUsed) {
          return res.status(200).json({ message: TOKEN_USED })
        }
        if (unsubscribeTokenExpires < new Date()) {
          return res.status(200).json({ message: TOKEN_EXPIRED })
        }

        return res.status(200).json({ message: OK })
      } catch (error) {
        return res.status(500).end()
      }
    }
    case 'HEAD': {
      return res.status(204).end()
    }
    default: {
      return res.status(405).end()
    }
  }
}
