import { Worker, Job } from 'bullmq'

import {
  SubscriptionModel,
  WasteAvailableSubscriptionModel,
  WasteRemovalEventModel,
} from '../../db/models'
import type { FilterQuery, Types } from 'mongoose'
import type { PrepareSubscriptionRunJobData } from '../../types/subscription'
import type { Subscription } from '../../db/models/subscription'
import dbConnect from '../../db/connection'
import { prepareSubsctionRunQueue } from '../queues'
import { requestsPerMinute } from '../email/sendPulseApiRequestLimiter'
import { redisConnection } from '../../db/redisConnection'
import {
  JOB_ENSURE_USERS_SUBSCRIBED,
  JOB_SEND_SUBSCRIPTION_BATCH,
} from '../queues/jobNames'
import { QUEUE_PREPARE_SUBSCRIPTION_RUN } from '../queues'
import { getJobName } from '../queues'
import { prepareSubscriptionData } from '../subscriptions/prepareSubscriptionData'
import { buildEncodedEmail } from '../email'
import { subscriptionRunQueue } from '../queues'

const getLastRunDate = (lastRunDate: Date | null) => {
  const backoff = new Date(Date.now() - 24 * 60 * 60 * 1000)

  if (!lastRunDate) return backoff

  const parsed = new Date(lastRunDate)

  if (isNaN(parsed.valueOf())) {
    console.error('Invalid lastRunDate')
    return backoff
  }

  return parsed
}

const prepareWasteAvailableSubscriptionData = async (
  userId: Types.ObjectId,
  lastRunDate: Date | null,
) => {
  //ToDo: check if user is not banned

  //ToDo: add subscription type
  //1. Get all user's waste available subscriptions
  //2. For each subscription iterate over it's locations
  //3. For each location in the subscription get all waste types
  //4. For each waste type check Redis the count of the new waste removal proposal where locationId === location._id and wasteType === wasteType
  //5. If there is no record in Redis: get previously mentioned data from the db and put it to Redis

  const items = await WasteAvailableSubscriptionModel.find({ user: userId })
  if (items.length === 0) return []
  const now = new Date()
  for (const item of items) {
    const { location, wasteTypes } = item

    if (wasteTypes.length === 0) continue

    for (const wasteType of wasteTypes) {
      //ToDo: add createdAt param
      const newAdsCounter = await WasteRemovalEventModel.find({
        waste: wasteType,
        createdAt: { $gt: getLastRunDate(lastRunDate) },
        date: { $gt: new Date(Date.now() + 12 * 60 * 60 * 1000) },
        isActive: true,
      })
    }
  }
}

const limit = 100

export const prepareSubsctionRunWorker =
  new Worker<PrepareSubscriptionRunJobData>(
    QUEUE_PREPARE_SUBSCRIPTION_RUN,
    async (job: Job<PrepareSubscriptionRunJobData>) => {
      const {
        runId,
        subscriptionVariantId,
        userId = '',
        lastRunDate,
      } = job.data

      const emails: any[] = []
      //ToDo: update db record for this run Id

      await dbConnect()
      const query: FilterQuery<Pick<Subscription, 'subscribed' | 'variant'>> = {
        subscribed: true,
        variant: subscriptionVariantId,
      }
      if (userId) query.user = { $gt: userId }

      const users = await SubscriptionModel.find(query)
        .sort({ _id: 1 })
        .limit(limit)
        .populate('user')
        .select('user')

      if (users.length === 0) {
        //ToDo: mark as completed
        return
      }

      for (const user of users) {
        const data = await prepareWasteAvailableSubscriptionData(
          user._id,
          lastRunDate,
        )
        const email = buildEncodedEmail(data)
        emails.push(email)
      }
      await subscriptionRunQueue.add(JOB_SEND_SUBSCRIPTION_BATCH, emails, {
        jobId,
      })
    },
    { connection: redisConnection },
  )
