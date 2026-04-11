import { Worker, Job } from 'bullmq'
import {
  SubscriptionBatchModel,
  SubscriptionModel,
  SubscriptionRunModel,
} from '../../db/models'
import type { FilterQuery, Types } from 'mongoose'
import type { PrepareSubscriptionRunJobData } from '../../types/subscription'
import { subscriptionVariantNames } from '../subscriptions'
import type { Subscription } from '../../db/models/subscription'
import dbConnect from '../../db/connection'
import { redisConnection as redis } from '../../db/redisConnection'
import {
  JOB_PREPARE_SUBSCRIPTION_RUN,
  JOB_SEND_SUBSCRIPTION_BATCH,
} from '../queues/jobNames'
import {
  QUEUE_PREPARE_SUBSCRIPTION_RUN,
  subscriptionRunQueue,
  prepareSubsctionRunQueue,
} from '../queues'

const { wasteAvailable, wasteRemoval } = subscriptionVariantNames
const batchLimit = 100

export const prepareSubsctionRunWorker =
  new Worker<PrepareSubscriptionRunJobData>(
    QUEUE_PREPARE_SUBSCRIPTION_RUN,
    async (job: Job<PrepareSubscriptionRunJobData>) => {
      //ToDo: mark subscription run as failed if job throws
      const {
        runId,
        subscriptionVariantName,
        userId,
        totalRecipients = 0,
      } = job.data

      await dbConnect()

      const subscriptionRun = await SubscriptionRunModel.findById({
        _id: runId,
      })

      if (!subscriptionRun) {
        throw new Error(`Cannot find subscriptionRun id ${runId}`)
      }

      if (
        subscriptionVariantName !== wasteAvailable &&
        subscriptionVariantName !== wasteRemoval
      ) {
        subscriptionRun.status = 'failed'
        subscriptionRun.lastHeartbeatAt = new Date()
        subscriptionRun.finishedAt = new Date()
        subscriptionRun.errorMessage = 'Incorrect subscriptionVariantName'
        await subscriptionRun.save()

        return
      }

      if (!subscriptionRun.startedAt) {
        subscriptionRun.startedAt = new Date()
      }

      const query: FilterQuery<Pick<Subscription, 'subscribed' | 'variant'>> = {
        subscribed: true,
        variant: subscriptionVariantName,
      }
      if (userId) query.user = { $gt: userId }

      const subs = await SubscriptionModel.find(query)
        .sort({ _id: 'asc' })
        .limit(batchLimit)
        .select({ user: 1, _id: 0 })
        .lean<{ user: Types.ObjectId }[]>()

      const recipientsCount = totalRecipients + subs.length

      subscriptionRun.lastHeartbeatAt = new Date()

      if (recipientsCount === 0) {
        subscriptionRun.status = 'completed'
        subscriptionRun.finishedAt = new Date()
      } else {
        subscriptionRun.status = 'processing'
      }

      if (subs.length === 0) {
        subscriptionRun.totalRecipients = recipientsCount
        await subscriptionRun.save()
        return
      }

      await subscriptionRun.save()

      const userIds = subs.map((s) => s.user.toString())
      const batch = await SubscriptionBatchModel.create({
        runId,
        recipientIds: userIds,
        recipientCount: userIds.length,
      })

      await subscriptionRunQueue.add(
        JOB_SEND_SUBSCRIPTION_BATCH,
        {
          runId,
          batchId: batch._id.toString(),
          subscriptionVariantName,
        },
        {
          attempts: 11,
          backoff: {
            type: 'exponential',
            delay: 4000,
          },
        },
      )

      prepareSubsctionRunQueue.add(JOB_PREPARE_SUBSCRIPTION_RUN, {
        runId,
        subscriptionVariantName,
        userId: userIds[length - 1],
        totalRecipients: recipientsCount,
      })
    },
    { connection: redis },
  )
