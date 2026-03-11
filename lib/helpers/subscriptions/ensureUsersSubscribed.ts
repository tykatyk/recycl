import { sendPulseFetcher } from '../email/sendPulseFetcher'
import { Subscription } from '../../db/models'
import dbConnect from '../../db/connection'
import {
  canCallAPI,
  requestsPerMinute,
} from '../email/sendPulseApiRequestLimiter'
import { withExponentialBackoff } from '../email/index'

const sendPulsePath = '/smtp/unsubscribe'

async function getUnsubscribedUsersFromProvider(limit: number, offset: number) {
  const unsubscribedUsers = await sendPulseFetcher(
    `${sendPulsePath}?limit=${limit}&offset=${offset}`,
    { signal: AbortSignal.timeout(5000) },
  )
  if (!Array.isArray(unsubscribedUsers)) {
    throw new Error('Invalid response from SendPulse API: expected an array')
  }

  return unsubscribedUsers
}

async function setSubscriptionsUsubscribed(emails: string[]) {
  await dbConnect(process.env.DATABASE_URL)
  return await Subscription.updateMany(
    { email: { $in: emails }, subscribed: true },
    { subscribed: false },
  )
}

export async function ensureUsersSubscribed() {
  let offset = 0
  const limit = 50
  const pace = 2 * Math.ceil((60 * 1000) / requestsPerMinute) // Time to wait between requests to stay within the rate limit
  let hasMore = true

  while (hasMore) {
    const users = await withExponentialBackoff(async () => {
      if (!(await canCallAPI())) {
        throw new Error('Rate limited')
      }

      await new Promise((r) => setTimeout(r, pace))

      return getUnsubscribedUsersFromProvider(limit, offset)
    })

    if (users.length === 0) return true

    const unsubscribedEmails = users.map((user) => user.email)
    await setSubscriptionsUsubscribed(unsubscribedEmails)

    hasMore = users.length === limit

    offset += limit
  }
}
