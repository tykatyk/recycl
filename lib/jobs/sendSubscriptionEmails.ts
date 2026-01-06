import { emailSenderSendpulse } from '../helpers/email/sendEmailSendpulse'
import prepareNotifications from '../helpers/email/prepareNotifications'
import {
  prepareEmailHtml,
  prepareEmailObj,
} from '../helpers/email/wasteRemovalSubscriptionEmail'
import EmailSendingDispatcher from '../helpers/email/emailSendingDispatcher'
import EmailSendingMetrics from '../helpers/email/emailSendingMetrix'
import { WasteRemovalNotification } from '../types/subscription'
import dotenv from 'dotenv'
import { Email } from '../types/email'
dotenv.config()

const host = process.env.HOST || ''
const brandName = process.env.BRAND || ''
const emailFrom = process.env.EMAIL_FROM || ''

const api = `${host}/api/jobs/notification`
const subject = 'Предстоящие события по сбору вторсырья в вашем городе'
const errorMessage = 'An error during processing subscription notifications'

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

async function processSubscriptions(metrix: EmailSendingMetrics) {
  if (!canSendEmails()) return

  try {
    //ToDo: this should directly access Db
    const response = await fetch(api)

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }

    //ToDo: try catch res.json()
    const notifications = await prepareNotifications()
    const dispatcher = new EmailSendingDispatcher()
    metrix.totalEmails = notifications.length

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
          // emailSenderSendpulse(email, metrix)
          metrix.totalEmailsProcessed++
        } catch (err) {
          console.error('Failed to send email', err)
        }
      })
      metrix.totalEmailsToProcess++
    })
    while (metrix.totalEmailsToProcess != metrix.totalEmailsProcessed) {
      setTimeout(() => {
        console.log(
          `Jobs added to dispatcher: ${metrix.totalEmailsToProcess}; jobs processed: ${metrix.totalEmailsProcessed}`,
        )
      }, 2000)
    }
  } catch (error) {
    console.error(errorMessage, error)
  }
}

export default processSubscriptions
