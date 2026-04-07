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
        console.error('Cannot find subscriptionRun')
        return
      }

      const lastHeartBeat = new Date()
      if (
        subscriptionVariantName !== wasteAvailable &&
        subscriptionVariantName !== wasteRemoval
      ) {
        subscriptionRun.status = 'failed'
        subscriptionRun.finishedAt = lastHeartBeat
        subscriptionRun.lastHeartbeatAt = lastHeartBeat
        subscriptionRun.errorMessage = 'Incorrect subscriptionVariantName'
        await subscriptionRun.save()

        return
      }

      if (!subscriptionRun.startedAt) {
        subscriptionRun.startedAt = new Date()
      }

      subscriptionRun.status = 'processing'
      subscriptionRun.lastHeartbeatAt = lastHeartBeat
      await subscriptionRun.save()

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

      //ToDo: maybe move this logic to senSubsEmailWorker
      if (subs.length < batchLimit) {
        const date = new Date()

        subscriptionRun.totalRecipients = recipientsCount
        subscriptionRun.lastHeartbeatAt = date

        if (recipientsCount === 0) {
          subscriptionRun.status = 'completed'
          subscriptionRun.finishedAt = date
        }

        await subscriptionRun.save()

        return
      }

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
