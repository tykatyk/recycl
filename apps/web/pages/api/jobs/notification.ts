import { NextApiRequest, NextApiResponse } from 'next'
import { apiHandler } from '../../../lib/helpers/errorHelpers'
import {
  dbConnect,
  SubscriptionVariantModel,
} from '@recycl/shared/dist/server/db'
import { redisConnection } from '@recycl/shared/dist/server/redis'
import { createSubscriptionRun } from '../../../lib/helpers/createSubscriptionRun'
import {
  QUEUE_PREPARE_SUBSCRIPTION_RUN,
  QUEUE_ENSURE_USERS_SUBSCRIBED,
  JOB_ENSURE_USERS_SUBSCRIBED,
  JOB_PREPARE_SUBSCRIPTION_RUN,
} from '@recycl/shared/dist/server/worker'
import { FlowProducer } from 'bullmq'
import { subscriptionVariantNames } from '@recycl/shared/dist/server/subscription'

async function requestHandler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).end()
  }

  const auth = req.headers['authorization']
  // if (auth !== `Bearer ${process.env.SEND_SUBSCRIPTION_EMAILS_TOKEN}`) {
  //   return res.status(401).end()
  // }

  const { wasteAvailable, wasteRemoval } = subscriptionVariantNames

  const { subscription: subscriptionVariantName } = req.body

  if (
    subscriptionVariantName !== wasteAvailable &&
    subscriptionVariantName !== wasteRemoval
  ) {
    return res.status(400).end()
  }

  try {
    await dbConnect()

    const subscriptionVariant = await SubscriptionVariantModel.findOne({
      name: subscriptionVariantName,
    })

    if (!subscriptionVariant) return res.status(404).end()

    const run = await createSubscriptionRun({
      subscriptionVariantName,
      requestedBy: 'system',
    })
    const ensureUsersSubscribedJobData = {
      offset: 0,
      limit: 50,
    }

    if (redisConnection.status === 'wait') await redisConnection.connect()

    const flowProducer = new FlowProducer({ connection: redisConnection })

    await flowProducer.add({
      name: JOB_PREPARE_SUBSCRIPTION_RUN,
      queueName: QUEUE_PREPARE_SUBSCRIPTION_RUN,
      data: {
        runId: run._id,
        subscriptionVariantName,
      },
      children: [
        {
          name: JOB_ENSURE_USERS_SUBSCRIBED,
          //ToDo: maybe add runId for better status monitoring
          data: ensureUsersSubscribedJobData,
          queueName: QUEUE_ENSURE_USERS_SUBSCRIBED,
        },
      ],
    })

    return res.status(202).json({ status: 'queued', runId: run._id })
  } catch (error) {
    console.error('Failed to enqueue subscription send. ', error)
    return res
      .status(500)
      .json({ error: 'Failed to enqueue subscription send' })
  }
}

export default apiHandler(requestHandler)
