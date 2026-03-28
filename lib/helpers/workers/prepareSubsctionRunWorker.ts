import { Worker, Job } from 'bullmq'
import {
  SubscriptionModel,
  SubscriptionJobRunModel,
  UserModel,
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

const getLastRunDate = async (
  subscriptionVariantName: typeof wasteAvailable | typeof wasteRemoval,
) => {
  const lastRun = await SubscriptionJobRunModel.findOne({
    subscriptionVariantName,
  })
    .select('startedAt')
    .sort({ startedAt: 'desc' })
  if (lastRun) {
    return lastRun.startedAt
  }
  return new Date(Date.now() - 24 * 60 * 60 * 1000)
}
export const prepareSubsctionRunWorker =
  new Worker<PrepareSubscriptionRunJobData>(
    QUEUE_PREPARE_SUBSCRIPTION_RUN,
    async (job: Job<PrepareSubscriptionRunJobData>) => {
      //ToDo: mark subscription run as failed if job throws
      const { runId, subscriptionVariantName, userId } = job.data

      await dbConnect()

      const subscriptionRun = await SubscriptionJobRunModel.findById({
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

      const userIds = subs.map((s) => s.user.toString())

      const users = await UserModel.find({ _id: { $in: userIds } })
        .select('name email')
        .lean<{ _id: string; name: string; email: string }[]>()

      if (users.length === 0) {
        const date = new Date()

        subscriptionRun.status = 'completed'
        subscriptionRun.lastHeartbeatAt = date
        subscriptionRun.finishedAt = date
        await subscriptionRun.save()

        return
      }
      const lastRun = await getLastRunDate(subscriptionVariantName)

      for (const user of users) {
        const { _id, name, email } = user
        await subscriptionRunQueue.add(JOB_SEND_SUBSCRIPTION_BATCH, {
          runId,
          userId: _id,
          userName: name,
          userEmail: email,
          subscriptionVariantName,
          lastRunDate: lastRun,
        })
      }

      if (userIds.length === batchLimit) {
        prepareSubsctionRunQueue.add(JOB_PREPARE_SUBSCRIPTION_RUN, {
          //ToDo: add number of attempts
          runId,
          subscriptionVariantName,
          userId: userIds[length - 1],
        })
      }
    },
    { connection: redis },
  )
