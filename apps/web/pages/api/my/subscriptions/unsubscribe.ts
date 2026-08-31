import { NextApiRequest, NextApiResponse } from 'next'
import {
  dbConnect,
  UserModel,
  SubscriptionModel,
  UnsubscribeToken,
} from '@recycl/shared/dist/server/db'
import {
  responseErrrorCodes,
  responseStatuses,
} from '../../../../lib/helpers/errorHelpers'
import { email as emailSchema } from '@recycl/shared/dist/validation'
import { validationErrorResponse } from '../../../../lib/helpers/responses'
import type { ApiResponseStatus } from '../../../../lib/helpers/responses'

const { NOT_FOUND, EXPIRED } = responseErrrorCodes
const { SUCCESS, ERROR } = responseStatuses

const tokenNotFoundUnsubscribe = async (
  email: string | string[] | undefined,
  res: NextApiResponse<ApiResponseStatus>,
) => {
  let validatedEmail = ''
  try {
    const validated = await emailSchema.validate(email)
    validatedEmail = validated
  } catch (error) {
    return validationErrorResponse(error, res)
  }

  await dbConnect()
  const user = await UserModel.findOne({ email: validatedEmail }).select('_id')
  if (!user) {
    return res.json({
      status: ERROR,
      error: { code: NOT_FOUND, message: 'User not found' },
    })
  }

  //ToDo: Instead of immediate unsubscribe,send an email to the user with a link to unsubscribe
  const subscription = await SubscriptionModel.findOneAndUpdate(
    { user: user._id, subscribed: true },
    {
      subscribed: false,
    },
  )

  if (!subscription) {
    return res.json({
      status: ERROR,
      error: {
        code: NOT_FOUND,
        message: 'Subscription not found',
      },
    })
  }

  return res.json({ status: SUCCESS })
}

const initialUnsubscribe = async (
  token: string | string[] | undefined,
  res: NextApiResponse<ApiResponseStatus>,
) => {
  if (typeof token !== 'string') {
    return res.status(400).end()
  }

  await dbConnect()
  const unsubscribeToken = await UnsubscribeToken.findOne({
    value: token,
  })

  if (!unsubscribeToken) {
    return res.json({
      status: ERROR,
      error: { code: NOT_FOUND, message: 'Unsubscribe token not found' },
    })
  }

  const subscription = await SubscriptionModel.findOne({
    _id: unsubscribeToken.subscription,
  })

  if (!subscription) {
    return res.json({
      status: ERROR,
      error: { code: NOT_FOUND, message: 'Subscription not found' },
    })
  }

  const { used, expires } = unsubscribeToken

  if (used || expires < new Date()) {
    return res.status(200).json({
      status: ERROR,
      error: { code: EXPIRED, message: 'Token used or expired' },
    })
  }

  subscription.subscribed = false
  await subscription.save()

  unsubscribeToken.used = true
  await unsubscribeToken.save()

  return res.json({ status: SUCCESS })
}

const tokenExpiredOrUsedUnsubscribe = async (
  token: string | string[] | undefined,
  res: NextApiResponse<ApiResponseStatus>,
) => {
  if (typeof token !== 'string') {
    return res.status(400).end()
  }

  await dbConnect()

  const unsubscribeToken = await UnsubscribeToken.findOne({
    value: token,
  })

  if (!unsubscribeToken) {
    return res.status(200).json({
      status: ERROR,
      error: {
        code: NOT_FOUND,
        message: 'Unsubscribe token not found',
      },
    })
  }

  const subscription = await SubscriptionModel.findOne({
    _id: unsubscribeToken.subscription,
  })

  if (!subscription) {
    return res.json({
      status: ERROR,
      error: {
        code: NOT_FOUND,
        message: 'Subscription not found',
      },
    })
  }

  const { subscribed } = subscription

  if (!subscribed) {
    return res.json({ status: SUCCESS })
  }

  subscription.subscribed = false
  await subscription.save()

  unsubscribeToken.used = true
  await unsubscribeToken.save()

  return res.json({ status: SUCCESS })
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
