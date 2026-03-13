import { Worker, Job } from 'bullmq'
import {
  getUnsubscribedUsersFromProvider,
  setSubscriptionsUsubscribed,
} from '../subscriptions'
import { ensureUserSubscribedQueue } from '../queues'
import { EnsureUsersSubscribedJobData } from '../../types/subscription'
import { requestsPerMinute } from '../email/sendPulseApiRequestLimiter'
import { redisConnection } from '../../db/redisConnection'
import { JOB_ENSURE_USERS_SUBSCRIBED } from '../queues/jobNames'
import { QUEUE_ENSURE_USERS_SUBSCRIBED } from '../queues'
import { getJobName } from '../queues'

export const ensureUsersSubscribedWorker =
  new Worker<EnsureUsersSubscribedJobData>(
    QUEUE_ENSURE_USERS_SUBSCRIBED,
    async (job: Job<EnsureUsersSubscribedJobData>) => {
      if (job.name !== JOB_ENSURE_USERS_SUBSCRIBED) return
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
        await ensureUserSubscribedQueue.add(
          getJobName({ offset: nextOffset, limit }),
          {
            offset: nextOffset,
            limit,
          },
          //ToDo: maybe add jobId: runId for better status monitoring
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
