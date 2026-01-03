import { emailSenderSendpulse } from '../helpers/email/sendEmailSendpulse'
import {
  prepareEmailHtml,
  prepareEmailObj,
} from '../helpers/email/wasteRemovalSubscriptionEmail'
import fs from 'fs'
import { CronJob } from 'cron'
import EmailSendingDispatcher from '../helpers/email/emailSendingDispatcher'
import EmailSendingMetrics from '../helpers/email/emailSendingMetrics'
import { WasteRemovalNotification } from '../types/subscription'
import dotenv from 'dotenv'
import path from 'path'
dotenv.config()
//ToDo refactor access to process.env
const host = process.env.HOST
const api = `${host}/api/jobs/notification`
const subject = 'Предстоящие события по сбору вторсырья в вашем городе'
const errorMessage = 'An error during processing subscription notifications'
const lockPath = path.join(process.cwd(), 'subscriptionNotification.lock')

async function processSubscriptions() {
  try {
    const response = await fetch(api)

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }

    //ToDo: try catch res.json()
    const notifications: WasteRemovalNotification[] = await response.json()
    const dispatcher = new EmailSendingDispatcher()
    const metrics = new EmailSendingMetrics()

    notifications.forEach((notification) => {
      if (!notification.receiverEmail) {
        console.log('No receiver email')
        return
      }
      dispatcher.addTask(async () => {
        try {
          const html = prepareEmailHtml(notification)
          const email = prepareEmailObj(notification, subject, html)

          return
          await emailSenderSendpulse(email, metrics)
        } catch (err) {
          console.error('Failed to send email', err)
        }
      })
    })
  } catch (error) {
    console.error(errorMessage, error)
  }
}

function createLock() {
  try {
    fs.writeFileSync(lockPath, '', { flag: 'wx' })
    return true
  } catch (err: any) {
    if (err.code === 'EEXIST') {
      console.log('Lock file already exists')
    }
    console.log('Cannot create a lock')
    return false
  }
}

function removeLock() {
  if (fs.existsSync(lockPath)) fs.unlinkSync(lockPath)
}

process.on('SIGINT', removeLock) // Ctrl+C
process.on('SIGTERM', removeLock) // kill
process.on('exit', removeLock) // graceful exit

async function runJob() {
  if (!createLock()) return

  try {
    console.log('Job started.')

    await processSubscriptions()

    console.log('Job finished.')
  } catch (err) {
    console.error('Job failed:', err)
  } finally {
    removeLock()
  }
}

const sendSubscriptionEmails = new CronJob(
  '0 * * * * *', // cronTime
  async function () {
    await runJob()
  }, // onTick
  null, // onComplete
  true, // start
)

export default runJob()
// export default sendSubscriptionEmails
