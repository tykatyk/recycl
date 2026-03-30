import { Worker, Job } from 'bullmq'
import { QUEUE_SUBSCRIPTION_RUN } from '../queues'
import { SendSubscriptionEmailJobData } from '../../types/subscription'
import { redisConnection as redis } from '../../db/redisConnection'
import { sendPulseFetcher } from '../email/sendPulseFetcher'
import { Email, SendPulseSMPTResponse } from '../../types/email'
import {
  SubscriptionEmailDeliveryModel,
  SubscriptionRunModel,
  UserModel,
} from '../../db/models'
import { subscriptionVariantNames } from '../subscriptions'
import { getWasteAvailableEmail } from '../subscriptions/wasteAvailableSubscription'
import { getWasteRemovalEmail } from '../subscriptions/wasteRemovalSubscription'
const { wasteAvailable, wasteRemoval } = subscriptionVariantNames
import { createSendPulseError } from '../../errors'
import type { SendPulseError } from '../../types/email'
import { emailsPerHour } from '../email/sendPulseApiRequestLimiter'
import { isJobTimedOut } from '../subscriptions/sendSubscriptionEmails'

const sendEmailEndpoint = '/smtp/emails'

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
  return new Date(Date.now() - 24 * 60 * 60 * 1000)
}

export const sendSubscriptionEmailWorker =
  new Worker<SendSubscriptionEmailJobData>(
    QUEUE_SUBSCRIPTION_RUN,
    async (job: Job<SendSubscriptionEmailJobData>) => {
      const { runId, userIds, subscriptionVariantName } = job.data
      const { attempts = 1 } = job.opts
      const { attemptsMade, timestamp } = job

      let idempotencyKey = ''
      let userId = ''
      let userEmail = ''

      let totalRecipients = 0

      const counters = {
        sentCount: 0,
        failedCount: 0,
        skippedCount: 0,
      }

      try {
        const users = await UserModel.find({ _id: { $in: userIds } })
          .select('name email')
          .lean<{ _id: string; name: string; email: string }[]>()

        if (users.length === 0) return

        const lastRunDate = await getLastRunDate(subscriptionVariantName, runId)

        for (const user of users) {
          const { _id, name: userName, email } = user
          userId = _id.toString()
          userEmail = email

          idempotencyKey = buildEmailIdempotencyKey({
            runId,
            userId,
          })

          const run = await SubscriptionRunModel.findById(runId, {})
          if (!run) throw new Error(`Run ${runId} not found`)

          totalRecipients = run.totalRecipients

          if (run.status === 'cancelRequested' || run.status === 'cancelled') {
            counters.skippedCount += 1
            continue
          }

          if (isJobTimedOut(new Date(timestamp))) {
            counters.skippedCount += 1
            continue
          }

          const existing = await SubscriptionEmailDeliveryModel.findOne({
            idempotencyKey,
          })

          if (existing?.status === 'sent') {
            continue
          }

          let emailObj: Email | null = null
          if (subscriptionVariantName == wasteAvailable) {
            emailObj = await getWasteAvailableEmail({
              userId,
              userName,
              userEmail,
              lastRunDate,
            })
          } else {
            //ToDo: implemet getWasteRemovalEmail
            // emailObj = await getWasteRemovalEmail(userIds, lastRun)
          }

          if (!emailObj) {
            counters.skippedCount += 1
            continue
          }

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
            if (existing?.status == 'skipped') {
              counters.skippedCount -= 1
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
            throw createSendPulseError(result as SendPulseError)
          }
        }

        //update campaign stats
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
          { upsert: true },
        )
      } catch (error) {
        if (error.name === 'SendPulseError') {
          if (idempotencyKey && userId && userEmail) {
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
                  lastError:
                    error instanceof Error ? error.message : String(error),
                },
              },
              { upsert: true },
            )
          }

          if (attemptsMade === attempts) return
        }

        await SubscriptionRunModel.findByIdAndUpdate(runId, {
          lastHeartbeatAt: new Date(),
        })

        //reschedule the job
        throw error
      }
    },
    {
      connection: redis,
    },
  )
