import { Worker, Job } from 'bullmq'
import {
  getUnsubscribedUsersFromProvider,
  setSubscriptionsUsubscribed,
} from './subscription/ensureUsersSubscribed.js'
import { ensureUserSubscribedQueue, getJobName } from './queue/index.js'
import type { EnsureUsersSubscribedJobData } from './subscription/types.js'
import { requestsPerMinute } from './email/sendPulseApiRequestLimiter.js'
import { redisConnection } from '@recycl/shared/dist/server/redis/index.js'
import {
  JOB_ENSURE_USERS_SUBSCRIBED,
  QUEUE_ENSURE_USERS_SUBSCRIBED,
} from '@recycl/shared/dist/server/worker/index.js'

export const ensureUsersSubscribedWorker =
  new Worker<EnsureUsersSubscribedJobData>(
    QUEUE_ENSURE_USERS_SUBSCRIBED,
    async (job: Job<EnsureUsersSubscribedJobData>) => {
      if (job.name !== JOB_ENSURE_USERS_SUBSCRIBED) return
      try {
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
      } catch (err) {
        console.log(err)
        throw new Error('Cannot filter unsubscribed users')
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
