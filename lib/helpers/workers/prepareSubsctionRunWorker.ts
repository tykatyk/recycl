import { Worker, Job } from 'bullmq'
import { SubscriptionModel, SubscriptionEmailRunModel } from '../../db/models'
import type { FilterQuery, Types } from 'mongoose'
import type { PrepareSubscriptionRunJobData } from '../../types/subscription'
import { subscriptionVariantNames } from '../subscriptions'
import type { Subscription } from '../../db/models/subscription'
import dbConnect from '../../db/connection'
import { prepareSubsctionRunQueue } from '../queues'
import { redisConnection as redis } from '../../db/redisConnection'
import {
  JOB_PREPARE_SUBSCRIPTION_RUN,
  JOB_SEND_SUBSCRIPTION_BATCH,
} from '../queues/jobNames'
import { QUEUE_PREPARE_SUBSCRIPTION_RUN } from '../queues'
import { subscriptionRunQueue } from '../queues'
import { Email } from '../../types/email'
import { getWasteAvailableEmails } from '../subscriptions/wasteAvailableSubscription'
import { getWasteRemovalEmails } from '../subscriptions/wasteRemovalSubscription'

const { wasteAvailable, wasteRemoval } = subscriptionVariantNames
const batchLimit = 100

export const prepareSubsctionRunWorker =
  new Worker<PrepareSubscriptionRunJobData>(
    QUEUE_PREPARE_SUBSCRIPTION_RUN,
    async (job: Job<PrepareSubscriptionRunJobData>) => {
      const { runId, subscriptionVariantName, userId, lastRunDate } = job.data

      await dbConnect()

      const subscriptiionRun = await SubscriptionEmailRunModel.findById({
        _id: runId,
      })

      if (!subscriptiionRun) {
        console.error('Cannot find subscriptionRun')
        return
      }

      if (
        subscriptionVariantName !== wasteAvailable &&
        subscriptionVariantName !== wasteRemoval
      ) {
        subscriptiionRun.status = 'failed'
        subscriptiionRun.lastHeartbeatAt = new Date()
        subscriptiionRun.errorMessage = 'Incorrect subscriptionVariantName'
        await subscriptiionRun.save()

        return
      }

      if (!subscriptiionRun.startedAt) {
        subscriptiionRun.startedAt = new Date()
        await subscriptiionRun.save()
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

      const userIds = subs.map((s) => s.user.toString())

      if (userIds.length === 0) {
        const date = new Date()

        subscriptiionRun.status = 'completed'
        subscriptiionRun.lastHeartbeatAt = date
        subscriptiionRun.finishedAt = date
        await subscriptiionRun.save()

        return
      }
      const lastRun = lastRunDate ?? new Date(Date.now() - 24 * 60 * 60 * 1000)

      let emails: Email[] = []
      if (subscriptionVariantName == wasteAvailable) {
        emails = await getWasteAvailableEmails(userIds, lastRun)
      } else {
        emails = await getWasteRemovalEmails(userIds, lastRun)
      }

      await subscriptionRunQueue.add(JOB_SEND_SUBSCRIPTION_BATCH, {
        runId,
        emails,
      })
      if (userIds.length === batchLimit) {
        prepareSubsctionRunQueue.add(JOB_PREPARE_SUBSCRIPTION_RUN, {
          runId,
          subscriptionVariantName,
          userId: userIds[length - 1],
          lastRunDate: lastRun,
        })
      }
    },
    { connection: redis },
  )
