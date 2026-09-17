import type {
  PrepareSubscriptionData,
  SubscriptionVariantName,
} from './types.js'
import { buildEncodedEmail } from '../email/index.js'
import {
  getSubscriptionHtml,
  getSubscriptionTitleAndHeader,
} from '../email/templates/subscriptionTemplates.js'
import { getWasteAvailableData } from './wasteAvailableSubscription.js'
import { getWasteRemovalData } from './wasteRemovalSubscription.js'
import { subscriptionVariantNames } from '@recycl/shared/dist/server/subscription/index.js'

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
