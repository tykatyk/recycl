import { Queue } from 'bullmq'
import { redisConnection } from '@recycl/shared/dist/server/redis'
import {
  JOB_ENSURE_USERS_SUBSCRIBED,
  QUEUE_SUBSCRIPTION_RUN,
  QUEUE_PREPARE_SUBSCRIPTION_RUN,
  QUEUE_ENSURE_USERS_SUBSCRIBED,
  QUEUE_REBUILD_SUPERCLUSTER_INDEX,
} from '@recycl/shared/dist/server/worker'
import type {
  PrepareSubscriptionRunJobData,
  SendSubscriptionEmailJobData,
  EnsureUsersSubscribedJobData,
} from '../subscription/types'

export const getJobName = (options: { offset: number; limit: number }) => {
  const { offset = 0, limit = 1 } = options
  return `${JOB_ENSURE_USERS_SUBSCRIBED}-page-${Math.floor(offset / limit)}`
}

export const rebuildSuperclusterIndexQueue = new Queue<any>(
  QUEUE_REBUILD_SUPERCLUSTER_INDEX,
  {
    connection: redisConnection,
    defaultJobOptions: {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 1000,
      },
      removeOnComplete: true,
      removeOnFail: 100,
    },
  },
)

export const subscriptionRunQueue = new Queue<SendSubscriptionEmailJobData>(
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
