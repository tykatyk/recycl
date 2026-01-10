import { NextApiRequest, NextApiResponse } from 'next'
import path from 'path'
import fs from 'fs/promises'
import { apiHandler } from '../../../lib/helpers/errorHelpers'
import dateFormatter from '../../../lib/helpers/dateFormatter'
import EmailSendingMetrcs from '../../../lib/helpers/email/emailSendingMetrics'
import processSubscriptions from '../../../lib/jobs/sendSubscriptionEmails'

const lockPath = path.join(process.cwd(), 'subscriptionNotification.lock')

const metrics = new EmailSendingMetrcs()
const metricsPath = 'logs/subscriptionEmailSendingMetrics'

const successMessage = 'Job finished succesfully'

async function createLock() {
  try {
    await fs.writeFile(lockPath, '', { flag: 'wx' })
    return true
  } catch (err: any) {
    if (err.code === 'EEXIST') {
      console.log('Lock file already exists')
    }
    console.log('Cannot create a lock')
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
    await ensureDirectoryExists(metricsPath)

    const jobStartedDateString = dateFormatter(metrics.jobStarted, 'T', '-')
    const path = `${metricsPath}/${jobStartedDateString}.txt`

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

function prepareMetrixText(metrics: EmailSendingMetrcs) {
  return Object.entries(metrics)
    .map(([key, value]) => `${key}: ${value}`)
    .join('\n')
}

async function notifications(req: NextApiRequest, res: NextApiResponse) {
  //ToDo: Add token authorization
  if (req.method !== 'GET') {
    return res.status(405).end()
  }

  if (!(await createLock())) {
    return res.status(500).json('Cannot create a lock file')
  }

  try {
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
    const metricsText = prepareMetrixText(metrics)

    writeMetricsToFile(metricsText)
  } catch (err) {
    console.error(err)
  }
}

process.on('SIGINT', removeLock) // Ctrl+C
process.on('SIGTERM', removeLock) // kill
process.on('exit', removeLock) // graceful exit

export default apiHandler(notifications)
