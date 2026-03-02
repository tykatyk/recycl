import path from 'path'
import fs from 'fs/promises'
import dayjs from 'dayjs'
import { sendPulseFetcher } from '../email/sendPulseFetcher'
import {
  prepareHtml,
  prepareEmailObj,
} from '../email/templates/wasteRemovalSubscriptionEmail'
import dotenv from 'dotenv'
import { Subscription } from '../../db/models'
import dateFormatter from '../../../lib/helpers/dateFormatter'
import { SubscriptionSendingStats } from './subscriptionSendingStats'
import { ensureDirectoryExists } from '../file'
import { WasteRemovalNotification } from '../../types/subscription'
import { withExponentialBackoff } from '../email'
import { canCallAPI } from '../email/sendPulseApiRequestLimiter'

dotenv.config({ path: '.env.local' })

const brandName = process.env.BRAND || ''

const subscriptionEmailSendingInterval = 24 * 60 * 60 * 1000 //24 hours

const subject = 'Предстоящие события по сбору вторсырья в вашем городе'
const sendEmailEndpoint = '/smtp/emails'

const metricsDirectory = path.join(__dirname, '../../../logs')

async function writeStatsToFile(metrics: SubscriptionSendingStats) {
  try {
    await ensureDirectoryExists(metricsDirectory)

    const jobStartedDate = dateFormatter(metrics.jobStarted, 'T', '-')
    //ToDo: rename metrix file
    const path = `${metricsDirectory}/${jobStartedDate}.txt`

    const metricsText = metrics.getSummary()

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

const logProgress = (total: number, metrics: SubscriptionSendingStats) => {
  const processed = metrics.totalEmailsProcessed
  console.log(`Jobs processed: ${processed} out of ${total}`)

  if (processed === total) {
    try {
      writeStatsToFile(metrics)
    } catch (err) {
      console.error(err)
    }
  }

  try {
    writeStatsToFile(metrics)
  } catch (err) {
    console.error(err)
  }
}

async function sendSubscriptionEmails(
  subscriptionData: WasteRemovalNotification[],
) {
  if (!subscriptionData || subscriptionData.length === 0) {
    console.log('No subscription data to process')
    return
  }

  const metrics = new SubscriptionSendingStats()
  const emailsPerHour = 50
  const pace = 2 * Math.ceil((60 * 60 * 1000) / emailsPerHour) // Time to wait between requests to stay within the rate limit

  for (const notification of subscriptionData) {
    if (!notification.receiverEmail) {
      console.log('No receiver email')
      return
    }

    const html = prepareHtml(notification)
    const bufferedHtml = Buffer.from(html, 'utf8')
    const encodedHtml = bufferedHtml.toString('base64')

    const email = prepareEmailObj({
      notification,
      subject,
      html: encodedHtml,
    })

    const task = async () => {
      try {
        const now = new Date()

        if (
          dayjs(now).diff(dayjs(metrics.jobStarted), 'milliseconds') >
          subscriptionEmailSendingInterval
        ) {
          throw new Error('Job execution time exceeded')
        }

        const result = await sendPulseFetcher(sendEmailEndpoint, {
          method: 'POST',
          body: JSON.stringify({ email }),
          signal: AbortSignal.timeout(5000),
        })

        if (result && result.id) {
          await Subscription.findOneAndUpdate(
            { listUnsubscribeToken: notification.listUnsubscribeToken },
            { lastSent: new Date() },
          )
        }
        metrics.append(result)
      } catch (err) {
        console.error('Failed to send email', err)
        metrics.append({
          error_code: `${brandName}_email_sending_error`,
          message: err instanceof Error ? err.message : 'Unknown error',
        })
      }
    }

    await withExponentialBackoff(async () => {
      if (!(await canCallAPI())) {
        throw new Error('Rate limited')
      }

      await new Promise((r) => setTimeout(r, pace))
      await task()
      logProgress(subscriptionData.length, metrics)
    })
  }
}

export default sendSubscriptionEmails
