import { Worker, Job } from 'bullmq'
import {
  getUnsubscribedUsersFromProvider,
  setSubscriptionsUsubscribed,
} from './subscription/ensureUsersSubscribed'
import { ensureUserSubscribedQueue, getJobName } from './queue'
import type { EnsureUsersSubscribedJobData } from './subscription/types'
import { requestsPerMinute } from './email/sendPulseApiRequestLimiter'
import { redisConnection } from '@recycl/shared/dist/server/redis'
import {
  JOB_ENSURE_USERS_SUBSCRIBED,
  QUEUE_ENSURE_USERS_SUBSCRIBED,
} from '@recycl/shared/dist/server/worker'

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
