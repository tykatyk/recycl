import { sendPulseFetcher } from '../email/sendPulseFetcher'
import { Subscription } from '../../db/models'
import Redis from 'ioredis'
import dbConnect from '../../db/connection'

const sendPulsePath = '/smtp/unsubscribe'

let offset = 0
const limit = 50

let usersFilterd = false

const requestQuota = {
  perSecond: 10,
  perMinute: 1000,
  perDay: 500_000,
}

const getLastSecondRequests = async () => 0
const getLastMinuteRequests = async () => 0
const getLastDayRequests = async () => 0

const incrementRequestCount = async (redis: Redis) => {
  const currentSec = Math.floor(Date.now() / 1000)
  const currentMinute = Math.floor(Date.now() / 60000)
  const currentDay = Math.floor(Date.now() / 86400000)

  const keyBase = 'sendPusleRequestsPer'

  const secondskey = `${keyBase}Second:${currentSec}`
  const minutesKey = `${keyBase}Minute:${currentMinute}`
  const dayskey = `${keyBase}Day:${currentDay}`

  await redis.incr(secondskey)
  await redis.expire(secondskey, 2)

  await redis.incr(minutesKey)
  await redis.expire(minutesKey, 60)

  await redis.incr(dayskey)
  await redis.expire(dayskey, 86400)
}

const canSend = async () => {
  const lastSecondRequests = await getLastSecondRequests()
  const lastMinuteRequests = await getLastMinuteRequests()
  const lastDayRequests = await getLastDayRequests()

  return (
    lastSecondRequests < requestQuota.perSecond &&
    lastMinuteRequests < requestQuota.perMinute &&
    lastDayRequests < requestQuota.perDay
  )
}

async function getUsubscribedUsersFromProvider(limit: number, offset: number) {
  const unsubscribedUsers = await sendPulseFetcher(
    `${sendPulsePath}?limit=${limit}&offset=${offset}`,
    { signal: AbortSignal.timeout(5000) },
  )
  if (!Array.isArray(unsubscribedUsers)) {
    throw new Error('Invalid response from SendPulse API: expected an array')
  }

  return unsubscribedUsers
}

async function updateSubscriptions(emails: string[]) {
  return await Subscription.updateMany(
    { email: { $in: emails }, subscribed: true },
    { subscribed: false },
  )
}

export async function ensureUsersSubscribed() {
  try {
    await dbConnect(process.env.DATABASE_URL)
    const redis = new Redis(process.env.REDIS_URL || '')

    while (!usersFilterd) {
      let canSendNext = await canSend()
      if (!canSendNext) continue

      await incrementRequestCount(redis)

      const unsubscribedUsers = await getUsubscribedUsersFromProvider(
        limit,
        offset,
      )

      if (unsubscribedUsers.length === 0) return true

      const unsubscribedEmails = unsubscribedUsers.map((user) => user.email)
      await updateSubscriptions(unsubscribedEmails)

      offset += limit
    }
  } catch (error) {
    console.error(error)
    return false
  }
}
