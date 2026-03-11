import { Worker, Job } from 'bullmq'
import {
  getUnsubscribedUsersFromProvider,
  setSubscriptionsUsubscribed,
} from '../../lib/helpers/subscriptions'
import { prepareSubsctionRunQueue } from '../queues'
import { EnsureUsersSubscribedJobData } from '../../lib/types/subscription'
import { requestsPerMinute } from '../../lib/helpers/email/sendPulseApiRequestLimiter'
import { redisConnection } from '../../lib/db/redisConnection'
import { JOB_PREPARE_SUBSCRIPTION_RUN } from '../../lib/helpers/queues/jobNames'
import { getJobId } from '../../lib/helpers/queues'

export const prepareSubsctionRunWorker =
  new Worker<EnsureUsersSubscribedJobData>(
    'subscription-sync',
    async (job: Job<EnsureUsersSubscribedJobData>) => {
      if (job.name !== JOB_PREPARE_SUBSCRIPTION_RUN) return
      const { offset, limit } = job.data

      const users = await getUnsubscribedUsersFromProvider(limit, offset)

      if (users.length === 0) {
        return {
          done: true,
          nextOffset: null,
          processed: 0,
        }
      }

      const unsubscribedEmails = users.map((user) => user.email)
      await setSubscriptionsUsubscribed(unsubscribedEmails)

      const hasMore = users.length === limit
      const nextOffset = hasMore ? offset + limit : null

      if (hasMore && nextOffset) {
        await prepareSubsctionRunQueue.add(
          JOB_PREPARE_SUBSCRIPTION_RUN,
          {
            offset: nextOffset!,
            limit,
          },
          {
            jobId: getJobId({ offset: nextOffset, limit }),
          },
        )
      }

      return {
        done: !hasMore,
        nextOffset,
        processed: users.length,
      }
    },
    {
      connection: redisConnection,
      concurrency: 1,
      limiter: {
        max: 1,
        duration: Math.ceil((60 * 1000) / requestsPerMinute),
      },
    },
  )
