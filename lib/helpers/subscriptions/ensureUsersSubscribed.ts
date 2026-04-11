import { sendPulseFetcher } from '../email/sendPulseFetcher'
import { SubscriptionModel } from '../../db/models'
import dbConnect from '../../db/connection'

const sendPulsePath = '/smtp/unsubscribe'

export const getUnsubscribedUsersFromProvider = async (
  limit: number,
  offset: number,
) => {
  const unsubscribedUsers = await sendPulseFetcher(
    `${sendPulsePath}?limit=${limit}&offset=${offset}`,
    { signal: AbortSignal.timeout(5000) },
  )
  if (!Array.isArray(unsubscribedUsers)) {
    throw new Error('Invalid response from SendPulse API: expected an array')
  }

  return unsubscribedUsers
}

export const setSubscriptionsUsubscribed = async (emails: string[]) => {
  await dbConnect(process.env.DATABASE_URL)
  return await SubscriptionModel.updateMany(
    { email: { $in: emails }, subscribed: true },
    { subscribed: false },
  )
}
