import { Worker, Job } from 'bullmq'
import { QUEUE_SUBSCRIPTION_RUN } from '../queues'
import { SendSubscriptionEmailJobData } from '../../types/subscription'
import { redisConnection as redis } from '../../db/redisConnection'
import { sendPulseFetcher } from '../email/sendPulseFetcher'
import { Email, SendPulseSMPTResponse } from '../../types/email'
import {
  SubscriptionEmailDeliveryModel,
  SubscriptionEmailRunModel,
} from '../../db/models'
import { subscriptionVariantNames } from '../subscriptions'
import { getWasteAvailableEmail } from '../subscriptions/wasteAvailableSubscription'
import { getWasteRemovalEmail } from '../subscriptions/wasteRemovalSubscription'
const { wasteAvailable, wasteRemoval } = subscriptionVariantNames

const sendEmailEndpoint = '/smtp/emails'

const buildEmailIdempotencyKey = (params: {
  runId: string
  userId: string
}) => {
  return `${params.runId}:${params.userId}`
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
      const idempotencyKey = buildEmailIdempotencyKey({ runId, userId })

      //ToDo: check if run is not cancelled
      //ToDo: set run's status as processing
      //ToDo: check if can call API
      try {
        const existing = await SubscriptionEmailDeliveryModel.findOne({
          idempotencyKey,
        })

        if (
          existing &&
          ['sent', 'delivered', 'complained'].includes(existing.status)
        ) {
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
          // emailObj = await getWasteRemovalEmail(userIds, lastRun)
        }

        if (!emailObj) {
          await SubscriptionEmailDeliveryModel.updateOne(
            {
              idempotencyKey,
            },
            {
              status: 'failed',
              lastError: 'Email is empty',
            },
          )
          return
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
          )
        } else {
          const { error_code = '', message = '' } = result
          await SubscriptionEmailDeliveryModel.updateOne(
            {
              idempotencyKey,
            },
            {
              status: 'failed',
              lastError: `Error code: ${error_code}, message: ${message}`,
            },
          )
          //ToDo: throw new error
        }
      } catch (error) {
        await SubscriptionEmailDeliveryModel.updateOne(
          {
            idempotencyKey,
          },
          {
            status: 'failed',
            runId,
            userId,
            email: userEmail,
            lastError: error instanceof Error ? error.message : String(error),
          },
        )

        await SubscriptionEmailRunModel.findByIdAndUpdate(runId, {
          lastHeartbeatAt: new Date(),
        })

        if (error.name === 'AbortError') {
          //reschedule the job
          throw error
        }
      }
    },
    { connection: redis },
  )
