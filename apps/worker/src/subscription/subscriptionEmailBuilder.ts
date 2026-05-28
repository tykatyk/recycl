import type { PrepareSubscriptionData, SubscriptionVariantName } from './types'
import { buildEncodedEmail } from '../email'
import {
  getSubscriptionHtml,
  getSubscriptionTitleAndHeader,
} from '../email/templates/subscriptionTemplates'
import { getWasteAvailableData } from './wasteAvailableSubscription'
import { getWasteRemovalData } from './wasteRemovalSubscription'
import { subscriptionVariantNames } from '@recycl/shared/dist/server/subscription'

export const getSubscriptionData = async (params: {
  userId: string
  runId: string
  lastRunDate: Date
  subscriptionName: SubscriptionVariantName
}) => {
  const { userId, runId, lastRunDate, subscriptionName } = params
  const { wasteAvailable, wasteRemoval } = subscriptionVariantNames

  switch (subscriptionName) {
    case wasteAvailable:
      return await getWasteAvailableData({
        userId,
        runId,
        lastRunDate,
      })

    case wasteRemoval:
      return await getWasteRemovalData({
        userId,
        runId,
        lastRunDate,
      })

    default:
      throw new Error('Unknown subscription name')
  }
}

export const getSubscriptionEmail = async (params: PrepareSubscriptionData) => {
  const { userName, userEmail, subscriptionName, data } = params

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
