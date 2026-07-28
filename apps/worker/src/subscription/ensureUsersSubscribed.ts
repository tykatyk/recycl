import { sendPulseFetcher } from '../email/sendPulseFetcher'
import { dbConnect } from '@recycl/shared/dist/server/db'
import { SubscriptionModel } from '@recycl/shared/dist/server/db'

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
    const message = 'Invalid response from SendPulse API: expected an array'
    console.error(message)
    throw new Error(message)
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
