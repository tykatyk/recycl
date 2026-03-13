import { Worker, Job } from 'bullmq'
import {
  getUnsubscribedUsersFromProvider,
  setSubscriptionsUsubscribed,
} from '../subscriptions'
import { prepareSubsctionRunQueue } from '../queues'
import { PrepareSubscriptionRunJobData } from '../../types/subscription'
import { requestsPerMinute } from '../email/sendPulseApiRequestLimiter'
import { redisConnection } from '../../db/redisConnection'
import {
  JOB_ENSURE_USERS_SUBSCRIBED,
  JOB_SEND_SUBSCRIPTION_BATCH,
} from '../queues/jobNames'
import { QUEUE_ENSURE_USERS_SUBSCRIBED } from '../queues'
import { getJobName } from '../queues'
import { prepareSubscriptionData } from '../subscriptions/prepareSubscriptionData'
import { buildEncodedEmail } from '../email'
import { subscriptionRunQueue } from '../queues'

export const prepareSubsctionRunWorker = async (options: {
  jobId: string
  userIds: string[]
}) => {
  const { jobId, userIds } = options
  const emails: any[] = []
  for (const usrId of userIds) {
    //ToDo: add subscription type
    const data = await prepareSubscriptionData('')
    const email = buildEncodedEmail(data)
    emails.push(email)
  }
  await subscriptionRunQueue.add(JOB_SEND_SUBSCRIPTION_BATCH, emails, {
    jobId,
  })
}
