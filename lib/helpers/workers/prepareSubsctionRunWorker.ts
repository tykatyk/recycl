import { Worker, Job } from 'bullmq'
import {
  SubscriptionModel,
  UserModel,
  WasteAvailableSubscriptionModel,
  WasteRemovalEventModel,
} from '../../db/models'
import type { FilterQuery, Types } from 'mongoose'
import type { PrepareSubscriptionRunJobData } from '../../types/subscription'
import type { Subscription } from '../../db/models/subscription'
import dbConnect from '../../db/connection'
import { prepareSubsctionRunQueue } from '../queues'
import { requestsPerMinute } from '../email/sendPulseApiRequestLimiter'
import { redisConnection as redis } from '../../db/redisConnection'
import { JOB_SEND_SUBSCRIPTION_BATCH } from '../queues/jobNames'
import { QUEUE_PREPARE_SUBSCRIPTION_RUN } from '../queues'
import { getJobName } from '../queues'
import { prepareSubscriptionData } from '../subscriptions/prepareSubscriptionData'
import { buildEncodedEmail } from '../email'
import { subscriptionRunQueue } from '../queues'
import { WasteAvailableSubscription } from '../../db/models/wasteAvailableSubsciption'

const getData = async (userId: string, lastRunDate: Date) => {
  //ToDo: check if user is not banned

  //ToDo: add subscription type
  //1. Get all user's waste available subscriptions
  //2. For each subscription iterate over it's locations
  //3. For each location in the subscription get all waste types
  //4. For each waste type check Redis the count of the new waste removal proposal where locationId === location._id and wasteType === wasteType
  //5. If there is no record in Redis: get previously mentioned data from the db and put it to Redis

  const items = await WasteAvailableSubscriptionModel.find({
    user: userId,
  })
  if (items.length === 0) return null

  const user = await UserModel.findById(userId).select<{
    name: string
    email: string
  }>('name email')

  if (!user) {
    console.error('User not found')
    return null
  }

  type WasteTypeCounters = { wasteName: string; newAdsCount: number }
  type Location = { name: string; wasteTypes: WasteTypeCounters[] }
  const locations: Location[] = []

  for (const item of items) {
    const { location, wasteTypes } = item

    if (!wasteTypes || wasteTypes.length === 0) continue

    const wasteTypeCounters: WasteTypeCounters[] = []

    for (const wasteType of wasteTypes) {
      let counter = 0
      const key = `WasteAvailableAdsCounter:${wasteType}`

      const redisCounter = await redis.get(key)
      if (redisCounter === null) {
        counter = await WasteRemovalEventModel.countDocuments({
          waste: wasteType,
          createdAt: {
            $gt: lastRunDate,
          },
          date: { $gt: new Date(Date.now() + 12 * 60 * 60 * 1000) },
          isActive: true,
        })
        await redis.set(key, counter)
        await redis.expire(key, 30 * 60) //30 minutes
      } else {
        counter = Number(redisCounter)
      }

      if (!counter) continue
      wasteTypeCounters.push({ wasteName: wasteType, newAdsCount: counter })
    }
    if (wasteTypeCounters.length === 0) continue

    locations.push({
      //ToDo: remove country name from description
      name: location.description,
      wasteTypes: wasteTypeCounters,
    })
  }

  if (locations.length === 0) return null
  return {
    receiverName: user.name,
    receiverEmail: user.email,
    locations,
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
      const lastRun = lastRunDate ?? new Date(Date.now() - 24 * 60 * 60 * 1000)

      for (const user of users) {
        const data = await getData(user._id.toString(), lastRun)
        const email = buildEncodedEmail(data)
        emails.push(email)
      }
      await subscriptionRunQueue.add(JOB_SEND_SUBSCRIPTION_BATCH, emails, {
        jobId,
      })
    },
    { connection: redis },
  )
