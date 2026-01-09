import { emailSenderSendpulse } from '../helpers/email/sendEmailSendpulse'
import prepareNotifications from '../helpers/email/prepareNotifications'
import {
  prepareEmailHtml,
  prepareEmailObj,
} from '../helpers/email/wasteRemovalSubscriptionEmail'
import EmailSendingDispatcher from '../helpers/email/emailSendingDispatcher'
import EmailSendingMetrics from '../helpers/email/emailSendingMetrics'
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const host = process.env.HOST || ''
const brandName = process.env.BRAND || ''
const emailFrom = process.env.EMAIL_FROM || ''

const subject = 'Предстоящие события по сбору вторсырья в вашем городе'

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

  //ToDo: try catch res.json()
  const notifications = await prepareNotifications()
  const dispatcher = new EmailSendingDispatcher()
  metrics.totalEmails = notifications.length

  notifications.forEach((notification) => {
    if (!notification.receiverEmail) {
      console.log('No receiver email')
      return
    }

    const html = prepareEmailHtml({ notification, host, brandName })
    const email = prepareEmailObj({
      notification,
      subject,
      html,
      brandName,
      emailFrom,
    })

    dispatcher.addTask(async () => {
      try {
        // return
        emailSenderSendpulse(email, metrics)
        metrics.totalEmailsProcessed++
      } catch (err) {
        console.error('Failed to send email', err)
      }
    })
    metrics.totalEmailsToProcess++
  })
  while (metrics.totalEmailsToProcess != metrics.totalEmailsProcessed) {
    setTimeout(() => {
      console.log(
        `Jobs added to dispatcher: ${metrics.totalEmailsToProcess}; jobs processed: ${metrics.totalEmailsProcessed}`,
      )
    }, 2000)
  }
}

export default processSubscriptions
