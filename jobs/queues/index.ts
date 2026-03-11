import { Queue } from 'bullmq'
import {
  PrepareSubscriptionRunJobData,
  EnsureUsersSubscribedJobData,
} from '../../lib/types/subscription'

import { redisConnection } from '../../lib/db/redisConnection'

export const prepareSubsctionRunQueue =
  //ToDo: use const for job name
  new Queue<EnsureUsersSubscribedJobData>('prepare-subscription-run', {
    connection: redisConnection,
    defaultJobOptions: {
      attempts: 6,
      backoff: {
        type: 'exponential',
        delay: 5000, // 5s, then 10s, 20s, 40s...
      },
      removeOnComplete: 1000,
      removeOnFail: 5000,
    },
  })
