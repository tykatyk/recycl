import type { PrepareSubscriptionData, SubscriptionVariantName } from './types'
import { buildEncodedEmail } from '../email'
import {
  getSubscriptionHtml,
  getSubscriptionTitleAndHeader,
} from '../email/templates/subscriptionTemplates'
import { getWasteAvailableData } from './wasteAvailableSubscription'
import { getWasteRemovalData } from './wasteRemovalSubscription'
import { subscriptionVariantNames } from '@recycl/shared/dist/server/subscription'

const getSubscriptionData = async (params: {
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
