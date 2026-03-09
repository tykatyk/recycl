import Redis from 'ioredis'

const requestsPerMinute = 1000
const requestsPerDay = 500000
export const emailsPerHour = 50
const emailsPerMonth = 12000

const redis = new Redis(process.env.REDIS_URL || '')
type RequestTimeLimits = 'minute' | 'day'
type SendEmailTimeLimit = 'hour' | 'month'

type RequestKeyBase = 'sendPusleRequestsPer'
type EmailKeyBase = 'sendPusleSentEmailsPer'

const keyBaseEmail: EmailKeyBase = 'sendPusleSentEmailsPer'
const RequestkeyBase: RequestKeyBase = 'sendPusleRequestsPer'

type GetRequestsCountKey =
  | { period: RequestTimeLimits; keyBase: RequestKeyBase }
  | { period: SendEmailTimeLimit; keyBase: EmailKeyBase }

const getKey = (options: GetRequestsCountKey) => {
  const { period, keyBase } = options
  let key = ''

  switch (period) {
    case 'minute':
      const currentMinute = Math.floor(Date.now() / (60 * 1000))
      key = `${keyBase}Minute:${currentMinute}`
      break
    case 'hour':
      const currentHour = Math.floor(Date.now() / (60 * 1000))
      key = `${keyBase}Minute:${currentHour}`
      break

    case 'day':
      const currentDay = Math.floor(Date.now() / (24 * 60 * 60 * 1000))
      key = `${keyBase}Day:${currentDay}`
      break
    case 'month':
      const currentMonth = Math.floor(Date.now() / (24 * 60 * 60 * 1000))
      key = `${keyBase}Day:${currentMonth}`
      break

    default:
      break
  }

  return key
}

const getCounter = async (key: string) => {
  return redis.get(key)
}

export const incrementRequestCount = async () => {
  const minuteKey = getKey({ period: 'minute', keyBase: RequestkeyBase })
  const dayKey = getKey({ period: 'day', keyBase: RequestkeyBase })

  await redis.incr(minuteKey)
  await redis.expire(minuteKey, 60)

  await redis.incr(dayKey)
  await redis.expire(dayKey, 86400)
}

export const canCallAPI = async () => {
  const minuteKey = getKey({ period: 'minute', keyBase: RequestkeyBase })

  const lastMinuteRequests = await getCounter(minuteKey)
  if (Number(lastMinuteRequests) >= requestsPerMinute) {
    return false
  }

  const dayKey = getKey({ period: 'day', keyBase: RequestkeyBase })
  const lastDayRequests = await getCounter(dayKey)

  if (Number(lastDayRequests) >= requestsPerDay) {
    return false
  }

  return true
}

export const canSendEmail = async () => {
  const hourKey = getKey({ period: 'hour', keyBase: keyBaseEmail })
  const hourCounter = Number(await getCounter(hourKey))
  if (hourCounter >= emailsPerHour) return false

  const monthKey = getKey({ period: 'month', keyBase: keyBaseEmail })
  const monthCounter = Number(await getCounter(monthKey))
  if (monthCounter >= emailsPerMonth) return false

  return true
}
