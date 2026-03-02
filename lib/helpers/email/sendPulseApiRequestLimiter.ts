import Redis from 'ioredis'
const redis = new Redis(process.env.REDIS_URL || '')

const requestQuota = {
  perSecond: 10,
  perMinute: 1000,
  perDay: 500_000,
}

const getLastSecondRequests = async () => 0
const getLastMinuteRequests = async () => 0
const getLastDayRequests = async () => 0

export const incrementRequestCount = async () => {
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

export const canCallAPI = async () => {
  const lastSecondRequests = await getLastSecondRequests()
  const lastMinuteRequests = await getLastMinuteRequests()
  const lastDayRequests = await getLastDayRequests()

  return (
    lastSecondRequests < requestQuota.perSecond &&
    lastMinuteRequests < requestQuota.perMinute &&
    lastDayRequests < requestQuota.perDay
  )
}
