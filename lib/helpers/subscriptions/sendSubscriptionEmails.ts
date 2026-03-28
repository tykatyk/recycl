import dayjs from 'dayjs'
import dotenv from 'dotenv'
import { SubscriptionModel } from '../../db/models'
import { WasteRemovalNotification } from '../../types/subscription'
import { withExponentialBackoff, buildEncodedEmail } from '../email'
import { canCallAPI, canSendEmail } from '../email/sendPulseApiRequestLimiter'
import { sendPulseFetcher } from '../email/sendPulseFetcher'
import { logProgress } from './subscriptionSendingLogger'
import { SubscriptionSendingStats } from './subscriptionSendingStats'
import { emailsPerHour } from '../email/sendPulseApiRequestLimiter'
import { maxJobDurationMs } from '.'
import { createAbortError, TimeoutError } from '../../errors'
import type { SendPulseSMPTResponse } from '../../types/email'

dotenv.config({ path: '.env.local' })

const sendEmailEndpoint = '/smtp/emails'
const oneHour = 60 * 60 * 1000

export const isJobTimedOut = (jobStarted: Date) => {
  return (
    dayjs(new Date()).diff(dayjs(jobStarted), 'milliseconds') > maxJobDurationMs
  )
}

const waitWithAbort = async (ms: number, signal?: AbortSignal) =>
  new Promise<void>((resolve, reject) => {
    if (signal?.aborted) reject(createAbortError())

    const timeout = setTimeout(() => {
      cleanup()
      resolve()
    }, ms)

    const onAbort = () => {
      clearTimeout(timeout)
      cleanup()
      reject(createAbortError())
    }

    const cleanup = () => {
      if (signal) {
        signal.removeEventListener('abort', onAbort)
      }
    }

    if (signal) {
      signal.addEventListener('abort', onAbort, { once: true })
    }
  })

const runWithRateLimitAndAbort = async (
  task: () => Promise<void>,
  pace: number,
  signal?: AbortSignal,
) => {
  await withExponentialBackoff(async () => {
    if (signal?.aborted) return

    if (!(await canCallAPI()) || !(await canSendEmail())) {
      throw new Error('Rate limited')
    }

    await waitWithAbort(pace, signal)
    if (signal?.aborted) return
    await task()
  })
}

const sendSingleSubscriptionEmail = async (
  notification: WasteRemovalNotification,
  metrics: SubscriptionSendingStats,
) => {
  if (isJobTimedOut(metrics.jobStarted)) {
    try {
      throw new TimeoutError('Job execution time exceeded')
    } catch (err) {
      metrics.append({
        error_code: err.code,
        message: err.message,
      })
    }
    return
  }

  const email = buildEncodedEmail(notification)

  const result = await sendPulseFetcher<SendPulseSMPTResponse>(
    sendEmailEndpoint,
    {
      method: 'POST',
      body: JSON.stringify({ email }),
    },
  )

  if (result && 'id' in result && result.id) {
    await SubscriptionModel.findOneAndUpdate(
      { listUnsubscribeToken: notification.listUnsubscribeToken },
      { lastSent: new Date() },
    )
  }

  metrics.append(result)
}

async function sendSubscriptionEmails(
  subscriptionData: WasteRemovalNotification[],
  metrics: SubscriptionSendingStats,
  signal?: AbortSignal,
) {
  if (signal?.aborted) return

  if (!subscriptionData || subscriptionData.length === 0) {
    console.log('No subscription data to process')
    return
  }
  metrics.totalEmailsToProcess = subscriptionData.length

  const pace = 2 * Math.ceil(oneHour / emailsPerHour)

  for (const notification of subscriptionData) {
    if (signal?.aborted) return

    if (!notification.receiverEmail) {
      console.log('No receiver email')
      continue
    }

    await runWithRateLimitAndAbort(
      () => sendSingleSubscriptionEmail(notification, metrics),
      pace,
      signal,
    )

    logProgress(subscriptionData.length, metrics)
  }
}

export default sendSubscriptionEmails
