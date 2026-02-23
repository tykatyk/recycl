//ToDo: this job should be done on the outer server

import { NextApiRequest, NextApiResponse } from 'next'
import path from 'path'
import fs from 'fs/promises'
import { apiHandler } from '../../../lib/helpers/errorHelpers'
import dateFormatter from '../../../lib/helpers/dateFormatter'
import { EmailSendingMetrics } from '../../../lib/helpers/email/emailSendingMetrics'
import type { MetricsSummary } from '../../../lib/helpers/email/emailSendingMetrics'
import processSubscriptions from '../../../lib/helpers/subscriptions/processSubscriptions'

const lockDirectory = path.join(
  __dirname,
  '../../../locks/subscriptionNotification.lock',
)

const lockPath = `${lockDirectory}/subscriptionNotification.lock`

const metricsDirectory = path.join(__dirname, '../../../logs')

const metrics = new EmailSendingMetrics()

const successMessage = 'Job finished succesfully'

async function createLock() {
  try {
    await ensureDirectoryExists(lockDirectory)
    await fs.writeFile(lockPath, '', { flag: 'wx' })
    return true
  } catch (err: any) {
    if (err.code === 'EEXIST') {
      console.error('Lock file already exists')
    }
    console.error('Cannot create a lock')
    return false
  }
}

async function removeLock() {
  await fs.unlink(lockPath)
}

async function ensureDirectoryExists(path: string) {
  try {
    await fs.mkdir(path, { recursive: true })
  } catch (error) {
    if (error.code !== 'EEXIST') {
      console.error(`Error creating directory: ${error.message}`)
    }
    throw error
  }
}

async function writeMetricsToFile(metricsText: string) {
  try {
    await ensureDirectoryExists(metricsDirectory)

    const jobStartedDate = dateFormatter(metrics.jobStarted, 'T', '-')
    const path = `${metricsDirectory}/${jobStartedDate}.txt`

    await fs.writeFile(path, metricsText, {
      flag: 'wx',
    })
  } catch (err: any) {
    console.log(err)
    if (err.code === 'EEXIST') {
      console.error('Metrics file already exists')
    }
    console.log(err)
  }
}

function prepareMetricsText(metrics: MetricsSummary) {
  const { errorMessages = [], ...rest } = metrics

  const metricsText = Object.entries(rest)
    .map(([key, value]) => `${key}: ${value}`)
    .join('\n')

  const errorsText = errorMessages.length
    ? `errorMessages:\n${errorMessages.join('\n')}`
    : 'errorMessages: none'

  return [metricsText, errorsText].join('\n')
}

async function requestHandler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).end()
  }

  const auth = req.headers['authorization']
  // if (auth !== `Bearer ${process.env.SEND_SUBSCRIPTION_EMAILS_TOKEN}`) {
  //   return res.status(401).end()
  // }

  try {
    const stats = await fs.stat(lockPath).catch(() => null)
    if (stats && Date.now() - stats.mtimeMs > 13 * 60 * 60 * 1000) {
      /*
       *Remove stale lock that is modified more than 13 hours ago.
       *13 hours = 30000 emails/2500 emails per hour as of Sendpulse limitations +1 extra hour
       */
      await removeLock()
    }

    if (!(await createLock())) {
      return res.status(500).json('Cannot create a lock file')
    }

    console.log('Job started.')
    await processSubscriptions(metrics)
    console.log(successMessage)

    res.json(successMessage)
  } catch (err) {
    console.error('Job failed:', err)
    res.status(500).json('An error while sending notification emails')
  } finally {
    await removeLock()
  }

  try {
    const metricsText = prepareMetricsText(metrics.getSummary())

    writeMetricsToFile(metricsText)
  } catch (err) {
    console.error(err)
  }
}

export default apiHandler(requestHandler)
