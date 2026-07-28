import { Worker, Job } from 'bullmq'
import { SendSubscriptionEmailJobData } from './subscription/types'
import { redisConnection as redis } from '@recycl/shared/dist/server/redis'
import { sendPulseFetcher } from './email/sendPulseFetcher'
import {
  SubscriptionEmailDeliveryModel,
  SubscriptionRunModel,
  SubscriptionBatchModel,
  UserModel,
} from '@recycl/shared/dist/server/db'
import {
  getSubscriptionData,
  getSubscriptionEmail,
} from './subscription/subscriptionEmailBuilder'
import { subscriptionVariantNames } from '@recycl/shared/dist/server/subscription'
import { QUEUE_SUBSCRIPTION_RUN } from '@recycl/shared/dist/server/worker'
import { createSendPulseError } from './email/sendPulseError'
import type { SendPulseSMPTResponse, SendPulseError } from './email/types'
import dayjs from 'dayjs'

const { wasteAvailable, wasteRemoval } = subscriptionVariantNames

const sendEmailEndpoint = '/smtp/emails'

const maxJobDurationMs = 24 * 60 * 60 * 1000 // 24 hours

const isJobTimedOut = (jobStarted: Date) => {
  return (
    dayjs(new Date()).diff(dayjs(jobStarted), 'milliseconds') > maxJobDurationMs
  )
}

const buildEmailIdempotencyKey = (params: {
  runId: string
  userId: string
}) => {
  return `${params.runId}:${params.userId}`
}

const getLastRunDate = async (
  subscriptionVariantName: typeof wasteAvailable | typeof wasteRemoval,
  runId: string,
) => {
  const previousRun = await SubscriptionRunModel.findOne({
    id: {
      $lt: runId,
    },
    subscriptionVariantName,
  })
    .select('startedAt')
    .sort({ _id: 'desc' })
    .limit(1)

  if (previousRun) {
    return previousRun.startedAt
  }
  return new Date(Date.now() - maxJobDurationMs)
}

export const sendSubscriptionEmailWorker =
  new Worker<SendSubscriptionEmailJobData>(
    QUEUE_SUBSCRIPTION_RUN,
    async (job: Job<SendSubscriptionEmailJobData>) => {
      const { runId, batchId, subscriptionVariantName } = job.data
      const { attempts = 1 } = job.opts
      const { attemptsMade, timestamp } = job

      const counters = {
        sentCount: 0,
        failedCount: 0,
        skippedCount: 0,
      }
      const skipRecipient = async (idempotencyKey: string, cause: string) => {
        counters.skippedCount += 1
        await SubscriptionEmailDeliveryModel.updateOne(
          {
            idempotencyKey,
          },
          {
            status: 'skipped',
            lastError: cause,
          },
          { upsert: true },
        )
      }

      try {
        const batch = await SubscriptionBatchModel.findByIdAndUpdate(
          batchId,

          {
            status: 'processing',
            startedAt: new Date(),
            lastHeartbeatAt: new Date(),
          },
        )
        if (!batch) {
          throw new Error(`Batch  ${batchId} not found`)
        }
        const users = await UserModel.find({ _id: { $in: batch.recipientIds } })
          .select('name email')
          .lean<{ _id: string; name: string; email: string }[]>()

        if (users.length === 0) return

        const lastRunDate = await getLastRunDate(subscriptionVariantName, runId)

        const run = await SubscriptionRunModel.findById(runId, {})
        if (!run) throw new Error(`Run ${runId} not found`)

        if (run.status === 'cancelRequested' || run.status === 'cancelled') {
          const date = new Date()

          run.lastHeartbeatAt = date
          run.finishedAt = date
          await run.save()
          return
        }

        for (const user of users) {
          const { _id, name: userName, email } = user
          const userId = _id.toString()
          const userEmail = email

          const idempotencyKey = buildEmailIdempotencyKey({
            runId,
            userId,
          })

          //check if email is sent less than 24 hours ago
          const recentySent = await SubscriptionEmailDeliveryModel.findOne({
            runId: {
              $ne: runId,
            },
            updatedAt: {
              $lte: new Date(Date.now() - maxJobDurationMs),
            },
            email: userEmail,
            status: 'sent',
            subscriptionVariantName,
          })

          if (recentySent) {
            await skipRecipient(idempotencyKey, 'Sent recently')
            continue
          }
          if (isJobTimedOut(new Date(timestamp))) {
            await skipRecipient(idempotencyKey, 'Job timed out')
            continue
          }

          const existing = await SubscriptionEmailDeliveryModel.findOne({
            idempotencyKey,
          })

          if (existing?.status === 'sent') {
            continue
          }

          const subscriptionData = await getSubscriptionData({
            userId,
            runId,
            lastRunDate,
            subscriptionName: subscriptionVariantName,
          })

          if (subscriptionData.length === 0) {
            await skipRecipient(idempotencyKey, 'No data')
            continue
          }

          const emailObj = await getSubscriptionEmail({
            userName,
            userEmail,
            subscriptionName: subscriptionVariantName,
            data: subscriptionData,
          })

          const result = await sendPulseFetcher<SendPulseSMPTResponse>(
            sendEmailEndpoint,
            {
              method: 'POST',
              body: JSON.stringify({ email: emailObj }),
            },
          )

          if ('id' in result) {
            counters.sentCount += 1

            if (existing?.status == 'failed') {
              counters.failedCount -= 1
            }

            await SubscriptionEmailDeliveryModel.updateOne(
              {
                idempotencyKey,
              },
              {
                status: 'sent',
              },
              { upsert: true },
            )
          } else {
            //failed to send an email
            if (!existing || existing.status !== 'failed') {
              counters.failedCount += 1
            }

            const error = createSendPulseError(result as SendPulseError)

            await SubscriptionEmailDeliveryModel.updateOne(
              {
                idempotencyKey,
              },
              {
                $setOnInsert: {
                  status: 'failed',
                  runId,
                  userId,
                  email: userEmail,
                  lastError: error.message,
                },
              },
              { upsert: true },
            )

            await SubscriptionBatchModel.findByIdAndUpdate(batchId, {
              $inc: {
                sentCount: counters.sentCount,
                failedCount: counters.failedCount,
                skippedCount: counters.skippedCount,
              },
              lastHeartbeatAt: new Date(),
              status: attemptsMade === attempts ? 'failed' : 'processing',
            })

            await SubscriptionRunModel.updateOne(
              { runId },
              {
                $inc: {
                  sentCount: counters.sentCount,
                  failedCount: counters.failedCount,
                  skippedCount: counters.skippedCount,
                },
                lastHeartbeatAt: new Date(),
              },
            )

            if (attemptsMade < attempts) throw error
          }
        }

        //update campaign stats
        const date = new Date()

        await SubscriptionBatchModel.findByIdAndUpdate(batchId, {
          $inc: {
            sentCount: counters.sentCount,
            skippedCount: counters.skippedCount,
          },
          lastHeartbeatAt: date,
          status: 'completed',
          finishedAt: date,
        })

        run.sentCount += counters.sentCount
        run.skippedCount += counters.skippedCount
        run.lastHeartbeatAt = date

        const remainingBatches = await SubscriptionBatchModel.findOne({
          runId: runId,
          status: { $in: ['queued', 'processing'] },
        })

        if (!remainingBatches) {
          const failed = await SubscriptionBatchModel.findOne({
            runId,
            status: 'failed',
          })

          run.status = failed ? 'failed' : 'completed'
          run.finishedAt = date
        }

        await run.save()
      } catch (error) {
        console.error(error)
        if (error.name === 'SendPulseError') {
          //reschedule the job
          throw error
        }
      }
    },
    {
      connection: redis,
    },
  )
