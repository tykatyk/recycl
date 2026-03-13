import { JOB_ENSURE_USERS_SUBSCRIBED } from './jobNames'
import { Queue } from 'bullmq'
import {
  PrepareSubscriptionRunJobData,
  SubscriptionRunJobData,
  EnsureUsersSubscribedJobData,
} from '../../types/subscription'

import { redisConnection } from '../../db/redisConnection'

export const getJobName = (options: { offset: number; limit: number }) => {
  const { offset = 0, limit = 1 } = options
  return `${JOB_ENSURE_USERS_SUBSCRIBED}-page-${Math.floor(offset / limit)}`
}

export const QUEUE_SUBSCRIPTION_RUN = 'subscriptionRun'
export const QUEUE_PREPARE_SUBSCRIPTION_RUN = 'prepareSubscriptionRun'
export const QUEUE_ENSURE_USERS_SUBSCRIBED = 'ensureUsersSubscribed'

export const subscriptionRunQueue = new Queue<SubscriptionRunJobData>(
  QUEUE_SUBSCRIPTION_RUN,
  {
    connection: redisConnection,
    defaultJobOptions: {
      attempts: 11,
      backoff: {
        type: 'exponential',
        delay: 5000,
      },
      removeOnComplete: 1000,
      removeOnFail: 5000,
    },
  },
)

export const prepareSubsctionRunQueue =
  new Queue<PrepareSubscriptionRunJobData>(QUEUE_PREPARE_SUBSCRIPTION_RUN, {
    connection: redisConnection,
    defaultJobOptions: {
      attempts: 6,
      backoff: {
        type: 'exponential',
        delay: 5000,
      },
      removeOnComplete: 1000,
      removeOnFail: 5000,
    },
  })

export const ensureUserSubscribedQueue =
  new Queue<EnsureUsersSubscribedJobData>(QUEUE_ENSURE_USERS_SUBSCRIBED, {
    connection: redisConnection,
    defaultJobOptions: {
      attempts: 6,
      backoff: {
        type: 'exponential',
        delay: 5000,
      },
      removeOnComplete: 1000,
      removeOnFail: 5000,
    },
  })
