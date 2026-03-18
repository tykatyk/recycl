//ToDo: this job should be done on the outer server or in a separate process
import { NextApiRequest, NextApiResponse } from 'next'
import path from 'path'
import fs from 'fs/promises'
import { apiHandler } from '../../../lib/helpers/errorHelpers'
import { createLock, removeLock, isStaleLock } from '../../../lib/helpers/file'
import { canSendEmails } from '../../../lib/helpers/email'
import {
  ensureUsersSubscribed,
  prepareSubscriptionData,
  sendSubscriptionEmails,
  SubscriptionSendingStats,
  maxJobDurationMs,
  writeStatsToFile,
  withAbortSignal,
} from '../../../lib/helpers/subscriptions'
import {
  SubscriptionVariantModel,
  SubscriptionEmailRunModel,
} from '../../../lib/db/models'
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

const lockDirectory = path.join(
  __dirname,
  '../../../locks/subscriptionNotification.lock',
)

const lockPath = `${lockDirectory}/subscriptionNotification.lock`
const jobStartedMessage = 'Job started.'
const cantCreateLockMessage = 'Cannot create a lock file'
const cantSendEmails = 'Cannot send emails'
const unknownErrorMessage = 'An error while sending notification emails'
// const subscriptionVariantId = '692d94649d358fe3fb068fdb'

async function wasteRemovalSubscriptionHandler(
  subscriptionVariantId: string,
  res: NextApiResponse,
) {
  let lockCreated = false
  let timer: NodeJS.Timeout | null = null
  let folderName = subscriptionVariantId ?? ''

  const metrics = new SubscriptionSendingStats()

  try {
    const lockStats = await fs.stat(lockPath).catch(() => null)

    if (lockStats) {
      const lockIsStale = isStaleLock(lockStats)
      if (lockIsStale) {
        console.log('Stale lock found. Removing it.')
        await removeLock(lockPath)
      } else {
        console.log('Job is already running.')
        return res.status(409).json('Job is already running')
      }
    }

    if (!canSendEmails()) return res.status(500).json(cantSendEmails)

    if (!(await createLock(lockDirectory, lockPath))) {
      console.error(cantCreateLockMessage)
      return res.status(500).json(cantCreateLockMessage)
    }
    lockCreated = true

    console.log(jobStartedMessage)

    const controller = new AbortController()

    const longTask = async (signal: AbortSignal) => {
      await withAbortSignal(() => ensureUsersSubscribed(), signal)

      const subscriptionData = await withAbortSignal(
        () => prepareSubscriptionData(subscriptionVariantId.toString()),
        signal,
      )

      await withAbortSignal(
        () => sendSubscriptionEmails(subscriptionData, metrics, signal),
        signal,
      )
    }

    timer = setTimeout(() => controller.abort(), maxJobDurationMs)

    await longTask(controller.signal)

    res.json(jobStartedMessage)
  } catch (err) {
    console.error('Job failed:', err)

    if (!res.headersSent) {
      res.status(500).json(unknownErrorMessage)
    }
  } finally {
    if (timer) {
      clearTimeout(timer)
    }

    metrics.jobFinished = new Date()
    if (folderName) {
      await writeStatsToFile(metrics).catch(() => {
        console.error('Failed to write subscription metrics to a file')
      })
    }

    if (lockCreated) {
      await removeLock(lockPath).catch(() => {
        console.error('Failed to remove the lock')
      })
    }
  }
}

async function wasteAvailableSubscriptionHandler(
  subscriptionVariantId: string,
  res: NextApiResponse,
) {
  try {
    await dbConnect()

    const run = await createSubscriptionRun({
      subscriptionVariantId: subscriptionVariantId,
      requestedBy: 'system',
    })
    const ensureUsersSubscribedRunJobData = {
      offset: 0,
      limit: 50,
    }

    //ToDo: implement lastRunDate
    const lastRunDate = await SubscriptionEmailRunModel.findOne({
      subscriptionVariantId,
    }).sort({ startedAt: 'desc' })

    const flowProducer = new FlowProducer({ connection: redisConnection })

    await flowProducer.add({
      name: JOB_PREPARE_SUBSCRIPTION_RUN,
      queueName: QUEUE_PREPARE_SUBSCRIPTION_RUN,
      data: {
        runId: run._id,
        lastRunDate,
      },
      opts: {
        jobId: `prepareSubscriptionRun:${run._id.toString()}`,
      },
      children: [
        {
          name: getJobName(ensureUsersSubscribedRunJobData),
          //ToDo: maybe add runId for better status monitoring
          data: ensureUsersSubscribedRunJobData,
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

async function requestHandler(req: NextApiRequest, res: NextApiResponse) {
  //ToDo: method should be POST
  if (req.method !== 'GET') {
    return res.status(405).end()
  }

  const { subscription: subscriptionVariantId } = req.query
  if (typeof subscriptionVariantId !== 'string') {
    return res.status(400).end()
  }

  const auth = req.headers['authorization']
  // if (auth !== `Bearer ${process.env.SEND_SUBSCRIPTION_EMAILS_TOKEN}`) {
  //   return res.status(401).end()
  // }

  const subscriptionVariant = await SubscriptionVariantModel.findOne({
    _id: subscriptionVariantId,
  })

  if (!subscriptionVariant) {
    return res.status(404).end()
  }

  switch (subscriptionVariant.name) {
    case 'wasteAdded':
      return await wasteAvailableSubscriptionHandler(
        subscriptionVariant._id.toString(),
        res,
      )

    case 'wasteRemoval':
      return await wasteRemovalSubscriptionHandler(
        subscriptionVariant._id.toString(),
        res,
      )

    default:
      return res.status(400)
  }
}

export default apiHandler(requestHandler)
