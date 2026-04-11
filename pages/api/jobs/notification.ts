import { NextApiRequest, NextApiResponse } from 'next'
import { apiHandler } from '../../../lib/helpers/errorHelpers'
import { SubscriptionVariantModel } from '../../../lib/db/models'
import { redisConnection } from '../../../lib/db/redisConnection'
import { createSubscriptionRun } from '../../../lib/helpers/subscriptions/createRun'
import dbConnect from '../../../lib/db/connection'
import {
  QUEUE_PREPARE_SUBSCRIPTION_RUN,
  QUEUE_ENSURE_USERS_SUBSCRIBED,
} from '../../../lib/helpers/queues'
import { JOB_PREPARE_SUBSCRIPTION_RUN } from '../../../lib/helpers/queues/jobNames'
import { getJobName } from '../../../lib/helpers/queues'
import { FlowProducer } from 'bullmq'
import { subscriptionVariantNames } from '../../../lib/helpers/subscriptions'

const { wasteAvailable, wasteRemoval } = subscriptionVariantNames

async function requestHandler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).end()
  }

  const auth = req.headers['authorization']
  // if (auth !== `Bearer ${process.env.SEND_SUBSCRIPTION_EMAILS_TOKEN}`) {
  //   return res.status(401).end()
  // }

  const { subscription: subscriptionVariantName } = req.body

  if (
    subscriptionVariantName !== wasteAvailable &&
    subscriptionVariantName !== wasteRemoval
  ) {
    return res.status(400).end()
  }

  try {
    const subscriptionVariant = await SubscriptionVariantModel.findOne({
      name: subscriptionVariantName,
    })

    if (!subscriptionVariant) return res.status(404).end()

    await dbConnect()

    const run = await createSubscriptionRun({
      subscriptionVariantName,
      requestedBy: 'system',
    })
    const ensureUsersSubscribedJobData = {
      offset: 0,
      limit: 50,
    }

    const flowProducer = new FlowProducer({ connection: redisConnection })

    await flowProducer.add({
      name: JOB_PREPARE_SUBSCRIPTION_RUN,
      queueName: QUEUE_PREPARE_SUBSCRIPTION_RUN,
      data: {
        runId: run._id,
        subscriptionVariantName,
      },
      opts: {
        jobId: `prepareSubscriptionRun:${run._id.toString()}`,
      },
      children: [
        {
          name: getJobName(ensureUsersSubscribedJobData),
          //ToDo: maybe add runId for better status monitoring
          data: ensureUsersSubscribedJobData,
          queueName: QUEUE_ENSURE_USERS_SUBSCRIBED,
        },
      ],
    })

    return res.status(202).json({ status: 'queued', runId: run._id })
  } catch (error) {
    console.error('Failed to enqueue subscription send', error)
    return res
      .status(500)
      .json({ error: 'Failed to enqueue subscription send' })
  }
}

export default apiHandler(requestHandler)
