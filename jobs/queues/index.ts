import { Queue } from 'bullmq'
import IORedis from 'ioredis'
import { PrepareSubscriptionRunJobData } from '../../lib/types/subscription'

const connection = new IORedis(process.env.REDIS_URL!, {
  maxRetriesPerRequest: null,
})

// export type EnsureUsersSubscribedJobData = {
//   offset: number
//   limit: number
// }

export const emailQueue = new Queue<PrepareSubscriptionRunJobData>(
  'prepare-subscription-run',
  {
    connection,
    defaultJobOptions: {
      attempts: 11,
      backoff: {
        type: 'exponential',
        delay: 5000, // 5s, then 10s, 20s, 40s...
      },
      removeOnComplete: 1000,
      removeOnFail: 5000,
    },
  },
)
