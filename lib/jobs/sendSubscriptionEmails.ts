import { emailSenderSendpulse } from '../helpers/email/sendEmailSendpulse'
import prepareEmailText from '../helpers/email/wasteRemovalSubscriptionEmail'
import fs from 'fs'
import { CronJob } from 'cron'
import EmailSendingDispatcher from '../helpers/email/emailSendingDispatcher'
import { WasteRemovalNotification } from '../types/subscription'
import { default as fetch } from 'node-fetch'

const brandName = 'Recycl'
const emailFrom = 'notify@yoused.com.ua'
const host = 'http://localhost:3000'
const api = `${host}/api/jobs/notification`
const subject = 'Предстоящие события по сбору вторсырья в вашем городе'
const errorMessage = 'An error during processing subscription notifications'
const lockPath = './subscriptionNotification.lock'

async function sendEmail(notification: WasteRemovalNotification) {
  return
  if (!notification.receiverEmail) {
    console.log('No receiver email')
    return
  }

  if (!notification.receiverName) {
    notification.receiverName = notification.receiverEmail
  }

  const emailHtml = prepareEmailText(notification)
  const email = {
    html: emailHtml,
    subject,
    from: {
      name: brandName,
      email: emailFrom,
    },
    to: [
      {
        name: notification.receiverName,
        email: notification.receiverEmail,
      },
    ],
  }
  await emailSenderSendpulse(email)
}

async function processSubscriptions() {
  try {
    const response = await fetch(api)

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }

    //ToDo: try catch res.json()
    const notifications: WasteRemovalNotification[] = await response.json()

    const dispatcher = new EmailSendingDispatcher()
    notifications.forEach((notification) => {
      dispatcher.addTask(() => {
        sendEmail(notification)
      })
    })
  } catch (error) {
    console.log(errorMessage)
    console.log(api)
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

// export default runJob()
export default sendSubscriptionEmails
