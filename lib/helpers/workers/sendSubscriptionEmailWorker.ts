import { Worker, Job } from 'bullmq'
import { QUEUE_SUBSCRIPTION_RUN } from '../queues'
import { SendSubscriptionEmailJobData } from '../../types/subscription'
import { redisConnection as redis } from '../../db/redisConnection'
import { sendPulseFetcher } from '../email/sendPulseFetcher'
import { Email, SendPulseSMPTResponse } from '../../types/email'
import {
  SubscriptionEmailDeliveryModel,
  SubscriptionJobRunModel,
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

const setLastHeartBeat = async (runId: string) => {
  await SubscriptionJobRunModel.findByIdAndUpdate(runId, {
    lastHeartbeatAt: new Date(),
  })
}

export const sendSubscriptionEmailWorker =
  new Worker<SendSubscriptionEmailJobData>(
    QUEUE_SUBSCRIPTION_RUN,
    async (job: Job<SendSubscriptionEmailJobData>) => {
      const {
        runId,
        userId,
        userName,
        userEmail,
        lastRunDate,
        subscriptionVariantName,
      } = job.data
      const { attempts = 1 } = job.opts
      const { attemptsMade, timestamp } = job

      const idempotencyKey = buildEmailIdempotencyKey({ runId, userId })

      const run = await SubscriptionJobRunModel.findById(runId, {})
      if (!run) throw new Error(`Run ${runId} not found`)

      if (run.status === 'cancelRequested' || run.status === 'cancelled') {
        return
      }
      if (isJobTimedOut(new Date(timestamp))) return

      //ToDo: update campaign stats (sent, failed)
      try {
        const existing = await SubscriptionEmailDeliveryModel.findOne({
          idempotencyKey,
        })

        if (existing && existing.status === 'sent') {
          return
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
          throw new Error('Cannot build emailObj')
        }

        const result = await sendPulseFetcher<SendPulseSMPTResponse>(
          sendEmailEndpoint,
          {
            method: 'POST',
            body: JSON.stringify({ email: emailObj }),
          },
        )
        if ('id' in result) {
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
          //reschedule to job in case of a provider error
          throw createSendPulseError(result as SendPulseError)
        }
        await setLastHeartBeat(runId)
      } catch (error) {
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
              lastError: error instanceof Error ? error.message : String(error),
            },
          },
          { upsert: true },
        )

        await setLastHeartBeat(runId)

        if (
          (error.name === 'SendPulseError' || error.name === 'AbortError') &&
          attemptsMade < attempts
        ) {
          //reschedule the job
          throw error
        }
      }
    },
    {
      connection: redis,
      limiter: {
        max: Math.max(Math.floor(0.8 * emailsPerHour), 50),
        duration: 60 * 60 * 1000, //1 hour
      },
    },
  )
