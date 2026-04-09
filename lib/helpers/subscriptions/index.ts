import { createAbortError } from '../../errors'
import {
  PrepareSubscriptionData,
  SubscriptionVariantName,
} from '../../types/subscription'
import { buildEncodedEmail } from '../email'
import {
  getSubscriptionHtml,
  getSubscriptionTitleAndHeader,
} from '../email/templates/subscriptionTemplates'
import { getWasteAvailableData } from './wasteAvailableSubscription'
import { getWasteRemovalData } from './wasteRemovalSubscription'
export {
  ensureUsersSubscribed,
  getUnsubscribedUsersFromProvider,
  setSubscriptionsUsubscribed,
} from './ensureUsersSubscribed'
export { prepareSubscriptionData } from './wasteRemovalSubscription'
export { SubscriptionSendingStats } from './subscriptionSendingStats'
export { unsubscribeApiResponseCodes } from './unsubscribeApiResponseCodes'
export { logProgress } from './subscriptionSendingLogger'
export { writeStatsToFile } from './subscriptionSendingLogger'
export { default as sendSubscriptionEmails } from './sendSubscriptionEmails'
export const maxJobDurationMs = 24 * 60 * 60 * 1000 // 24 hours

export const subscriptionVariantNames = {
  wasteAvailable: 'wasteAvailable',
  wasteRemoval: 'wasteRemoval',
} as const

export const getSubscriptionData = async (params: {
  userId: string
  lastRunDate: Date
  subscriptionName: SubscriptionVariantName
}) => {
  const { userId, lastRunDate, subscriptionName } = params
  const { wasteAvailable, wasteRemoval } = subscriptionVariantNames

  switch (subscriptionName) {
    case wasteAvailable:
      return await getWasteAvailableData({
        userId,
        lastRunDate,
      })

    case wasteRemoval:
      return await getWasteRemovalData({
        userId,
        lastRunDate,
      })

    default:
      throw new Error('Unknown subscription name')
  }
}

export const getSubscriptionEmail = async (params: PrepareSubscriptionData) => {
  const { userId, lastRunDate, userName, userEmail, subscriptionName } = params

  const data = await getSubscriptionData({
    userId,
    lastRunDate,
    subscriptionName,
  })
  if (data.length == 0) return null

  const html = getSubscriptionHtml({
    subscriptionName,
    locations: [...data],
  })

  const { title } = getSubscriptionTitleAndHeader(subscriptionName)

  return buildEncodedEmail({
    userName,
    userEmail,
    subject: title,
    html,
  })
}

export const withAbortSignal = async <T>(
  task: () => Promise<T>,
  signal: AbortSignal,
): Promise<T> => {
  if (signal.aborted) {
    throw createAbortError()
  }

  let onAbort: (() => void) | null = null

  const abortPromise = new Promise<never>((_, reject) => {
    onAbort = () => reject(createAbortError())
    signal.addEventListener('abort', onAbort, { once: true })
  })

  try {
    return await Promise.race([task(), abortPromise])
  } finally {
    if (onAbort) {
      signal.removeEventListener('abort', onAbort)
    }
  }
}
