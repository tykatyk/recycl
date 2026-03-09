import { createAbortError } from '../../errors'

export { ensureUsersSubscribed } from './ensureUsersSubscribed'
export { prepareSubscriptionData } from './prepareSubscriptionData'
export { SubscriptionSendingStats } from './subscriptionSendingStats'
export { unsubscribeApiResponseCodes } from './unsubscribeApiResponseCodes'
export { logProgress } from './subscriptionSendingLogger'
export { writeStatsToFile } from './subscriptionSendingLogger'
export { default as sendSubscriptionEmails } from './sendSubscriptionEmails'
export const maxJobDurationMs = 24 * 60 * 60 * 1000 // 24 hours

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
