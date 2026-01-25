import { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '../../../lib/db/connection'
import { User, Subscription } from '../../../lib/db/models'
import { unsubscribeApiResponseCodes } from '../../../lib/subscriptions/unsubscribeApiResponseCodes'
import { unsubscribeApiResponseStatuses } from '../../../lib/subscriptions/unsubscribeApiResponseCodes'
import { emailSchema } from '../../../lib/validation'
import type { UnsubscribeApiResponse } from '../../../lib/subscriptions/types'

const {
  USER_NOT_FOUND,
  SUBSCRIPTION_NOT_FOUND,
  TOKEN_NOT_FOUND,
  TOKEN_EXPIRED,
  TOKEN_USED,
  OK,
} = unsubscribeApiResponseCodes

const { SUCCESS, ERROR } = unsubscribeApiResponseStatuses

const handleEmailUnsubscribe = async (
  email: string,
  res: NextApiResponse<UnsubscribeApiResponse>,
) => {
  if (!emailSchema.validate(email)) {
    return res.status(400).end()
  }
  await dbConnect()
  const user = await User.findOne({ email }).select('_id').lean()
  if (!user) {
    return res.status(200).json({ status: ERROR, error: USER_NOT_FOUND })
  }
  const subscriptions = await Subscription.findOneAndUpdate(
    { user: user._id },
    {
      'elements.$[].subscribed': false,
      'elements.$[].unsubscribeTokenUsed': true,
    },
  )
  if (!subscriptions) {
    return res
      .status(200)
      .json({ status: ERROR, error: SUBSCRIPTION_NOT_FOUND })
  }

  return res.json({ status: SUCCESS, message: OK })
}

const handleTokenUnsubscribe = async (token: string, res: NextApiResponse) => {
  if (!token || typeof token !== 'string') {
    return res.status(400).end()
  }
  await dbConnect()
  const subscriptions = await Subscription.findOne({
    elements: { unsubscribeToken: token },
  })

  if (!subscriptions) {
    return res.status(200).json({ message: TOKEN_NOT_FOUND })
  }

  const element = subscriptions.elements.find(
    (el) => el.unsubscribeToken === token,
  )

  if (!element) {
    return res.status(200).json({ message: TOKEN_NOT_FOUND })
  }

  element.subscribed = false
  element.unsubscribeTokenUsed = true

  await subscriptions.save()
  return res.status(200).json({ message: OK })
}

export default async function unsubscribe(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  switch (req.method) {
    case 'POST': {
      const { email, token } = req.body

      if (email) {
        return handleEmailUnsubscribe(email, res)
      } else if (token) {
        return handleTokenUnsubscribe(token, res)
      } else {
        return res.status(400).end()
      }
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
