import IORedis from 'ioredis'

export const redisConnection = new IORedis(process.env.REDIS_URL!, {
  maxRetriesPerRequest: null,
  retryStrategy: () => null,
  // lazyConnect: true,
})
