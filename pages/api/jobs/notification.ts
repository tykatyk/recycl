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

const lockDirectory = path.join(
  __dirname,
  '../../../locks/subscriptionNotification.lock',
)

const lockPath = `${lockDirectory}/subscriptionNotification.lock`
const jobStartedMessage = 'Job started.'
const cantCreateLockMessage = 'Cannot create a lock file'
const cantSendEmails = 'Cannot send emails'
const unknownErrorMessage = 'An error while sending notification emails'

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
