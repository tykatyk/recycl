import Redis from 'ioredis'

const requestsPerMinute = 1000
const requestsPerDay = 500000
const emailsPerHour = 50
const emailsPerMonth = 12000

const redis = new Redis(process.env.REDIS_URL || '')

const keyBase = 'sendPusleRequestsPer'

//ToDo: implement getting last minute and last day requests from Redis

const getMinuteKey = () => {
  const currentMinute = Math.floor(Date.now() / (60 * 1000))
  return `${keyBase}Minute:${currentMinute}`
}

const getHourKey = () => {
  const currentHour = Math.floor(Date.now() / (60 * 60 * 1000))
  return `${keyBase}Hour:${currentHour}`
}

const getDayKey = () => {
  const currentDay = Math.floor(Date.now() / (24 * 60 * 60 * 1000))
  return `${keyBase}Day:${currentDay}`
}

const getMonthKey = () => {
  const currentDate = new Date()
  const currentMonth =
    currentDate.getUTCFullYear() * 12 + currentDate.getUTCMonth()
  return `${keyBase}Month:${currentMonth}`
}

const getCounter = async (key: string) => {
  return redis.get(key)
}

export const incrementRequestCount = async () => {
  const minuteKey = getMinuteKey()
  const dayKey = getDayKey()

  await redis.incr(minuteKey)
  await redis.expire(minuteKey, 60)

  await redis.incr(dayKey)
  await redis.expire(dayKey, 86400)
}

export const canCallAPI = async () => {
  const minuteKey = getMinuteKey()
  const lastMinuteRequests = await getCounter(minuteKey)
  if (Number(lastMinuteRequests) >= requestsPerMinute) {
    return false
  }

  const dayKey = getDayKey()
  const lastDayRequests = await getCounter(dayKey)

  if (Number(lastDayRequests) >= requestsPerDay) {
    return false
  }

  return true
}

export const canSendEmail = async () => {
  if (!(await canCallAPI())) return false

  const hourKey = getHourKey()
  const hourCounter = Number(await getCounter(hourKey))
  if (hourCounter >= emailsPerHour) return false

  const monthKey = getMonthKey()
  const monthCounter = Number(await getCounter(monthKey))
  if (monthCounter >= emailsPerMonth) return false

  return true
}
