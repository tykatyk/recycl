import { sendPulseFetcher } from '../email/sendPulseFetcher'
import prepareNotifications from './prepareNotifications'
import {
  prepareEmailHtml,
  prepareEmailObj,
} from '../email/templates/wasteRemovalSubscriptionEmail'
import EmailSendingDispatcher from '../email/emailSendingDispatcher'
import { EmailSendingMetrics } from '../email/emailSendingMetrics'
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const host = process.env.HOST || ''
const brandName = process.env.BRAND || ''
const emailFrom = process.env.EMAIL_FROM || ''

const subject = 'Предстоящие события по сбору вторсырья в вашем городе'

const sendEmailEndpoint = '/smtp/emails'

const logProcessionProgress = (total: number, metrics: EmailSendingMetrics) => {
  const processed = metrics.totalEmailsProcessed

  console.log(`Jobs processed: ${processed} out of ${total}`)

  if (processed < total) {
    setTimeout(() => {
      logProcessionProgress(total, metrics)
    }, 2000)
  }
}

const canSendEmails = () => {
  if (!host) {
    console.log('host is undefined')
    return false
  }

  if (!brandName) {
    console.log('No brand name')
    return false
  }

  if (!emailFrom) {
    console.log('No email from address')
    return false
  }
  return true
}

async function processSubscriptions(metrics: EmailSendingMetrics) {
  if (!canSendEmails()) return

  const notifications = await prepareNotifications()

  const dispatcher = new EmailSendingDispatcher()

  notifications.forEach((notification) => {
    if (!notification.receiverEmail) {
      console.log('No receiver email')
      return
    }

    const html = prepareEmailHtml({ notification, host, brandName })

    const bufferObj = Buffer.from(html, 'utf8')

    const encodedHtml = bufferObj.toString('base64')

    const email = prepareEmailObj({
      notification,
      host,
      brandName,
      subject,
      html: encodedHtml,
      emailFrom,
    })

    dispatcher.addTask(async () => {
      try {
        //ToDo: add timeout or abort controller for the request
        const result = await sendPulseFetcher(sendEmailEndpoint, {
          method: 'POST',
          body: JSON.stringify({ email }),
        })

        metrics.append(result)
      } catch (err) {
        console.error('Failed to send email', err)
        metrics.append({
          error_code: `${brandName}_email_sending_error`,
          message: err instanceof Error ? err.message : 'Unknown error',
        })
      }
    })
  })

  logProcessionProgress(notifications.length, metrics)
}

export default processSubscriptions
