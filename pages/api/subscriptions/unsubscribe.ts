import { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '../../../lib/db/connection'
import { User, Subscription, UnsubscribeToken } from '../../../lib/db/models'
import { unsubscribeApiResponseCodes } from '../../../lib/helpers/subscriptions/unsubscribeApiResponseCodes'
import { emailSchema } from '../../../lib/validation'
import type { UnsubscribeApiResponse } from '../../../lib/types/subscription'

const { NOT_FOUND, TOKEN_EXPIRED, TOKEN_USED, SUCCESS } =
  unsubscribeApiResponseCodes

const tokenNotFoundUnsubscribe = async (
  email: string | string[] | undefined,
  res: NextApiResponse<UnsubscribeApiResponse>,
) => {
  let validatedEmail = ''
  try {
    const validated = await emailSchema.validate({ email })
    validatedEmail = validated.email
  } catch (error) {
    return res.status(400).end()
  }

  await dbConnect()
  const user = await User.findOne({ email: validatedEmail }).select('_id')
  if (!user) {
    return res.status(404).end()
  }

  //ToDo: Instead of immediate unsubscribe,send an email to the user with a link to unsubscribe
  const subscription = await Subscription.findOneAndUpdate(
    { user: user._id, subscribed: true },
    {
      subscribed: false,
    },
  )

  if (!subscription) {
    return res.json({ status: NOT_FOUND })
  }

  return res.json({ status: SUCCESS })
}

const initialUnsubscribe = async (
  token: string | string[] | undefined,
  res: NextApiResponse<UnsubscribeApiResponse>,
) => {
  if (typeof token !== 'string') {
    return res.status(400).end()
  }

  await dbConnect()
  const unsubscribeToken = await UnsubscribeToken.findOne({
    value: token,
  })

  if (!unsubscribeToken) {
    return res.status(200).json({ status: NOT_FOUND })
  }

  const subscription = await Subscription.findOne({
    _id: unsubscribeToken.subscription,
  })

  if (!subscription) {
    return res.status(200).json({ status: NOT_FOUND })
  }

  const { used, expires } = unsubscribeToken

  if (used) {
    return res.status(200).json({ status: TOKEN_USED })
  }

  if (expires < new Date()) {
    return res.status(200).json({ status: TOKEN_EXPIRED })
  }

  subscription.subscribed = false
  await subscription.save()

  unsubscribeToken.used = true
  await unsubscribeToken.save()

  return res.status(200).json({ status: SUCCESS })
}

const tokenExpiredOrUsedUnsubscribe = async (
  token: string | string[] | undefined,
  res: NextApiResponse<UnsubscribeApiResponse>,
) => {
  if (typeof token !== 'string') {
    return res.status(400).end()
  }

  await dbConnect()

  const unsubscribeToken = await UnsubscribeToken.findOne({
    value: token,
  })

  if (!unsubscribeToken) {
    return res.status(404).json({ status: NOT_FOUND })
  }

  const subscription = await Subscription.findOne({
    _id: unsubscribeToken.subscription,
  })

  if (!subscription) {
    return res.status(404).json({ status: NOT_FOUND })
  }

  const { subscribed } = subscription

  if (!subscribed) {
    return res.status(200).json({ status: SUCCESS })
  }

  subscription.subscribed = false
  await subscription.save()

  unsubscribeToken.used = true
  await unsubscribeToken.save()

  return res.status(200).json({ status: SUCCESS })
}

export default async function Unsubscribe(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  switch (req.method) {
    case 'POST': {
      const { scope, data } = req.body

      switch (scope) {
        case 'email':
          try {
            return await tokenNotFoundUnsubscribe(data, res)
          } catch (error) {
            return res.status(500).end()
          }

        case 'token':
          try {
            return await tokenExpiredOrUsedUnsubscribe(data, res)
          } catch (error) {
            return res.status(500).end()
          }

        default:
          return res.status(400).end()
      }
    }

    case 'GET': {
      const { token } = req.query

      try {
        return await initialUnsubscribe(token, res)
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
