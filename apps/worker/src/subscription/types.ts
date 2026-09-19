import { wasteTypeNames } from '@recycl/shared/dist/constants.js'

type AggregatedSubscriptionData = {
  locationId: string
  locationName: string
  coordinates: number[]
  wasteTypes: (typeof wasteTypeNames)[number][]
}

type SubscriptionVariantName = 'wasteAvailable' | 'wasteRemoval'

type SendSubscriptionEmailJobData = {
  runId: string
  batchId: string
  subscriptionVariantName: SubscriptionVariantName
}

type PrepareSubscriptionRunJobData = {
  runId: string
  subscriptionVariantName: SubscriptionVariantName
  userId?: string
  totalRecipients?: number
}

type EnsureUsersSubscribedJobData = {
  offset: number
  limit: number
}

type WasteTypeCounter = {
  wasteName: (typeof wasteTypeNames)[number]
  newAdsCount: number
}

type WasteLocationCounter = {
  locationName: string
  locationId: string
  searchRadius: number
  adCounters: WasteTypeCounter[]
}

type PrepareSubscriptionData = {
  subscriptionName: SubscriptionVariantName
  userName: string
  userEmail: string
  data: WasteLocationCounter[]
}

export type {
  AggregatedSubscriptionData,
  SubscriptionVariantName,
  SendSubscriptionEmailJobData,
  PrepareSubscriptionRunJobData,
  EnsureUsersSubscribedJobData,
  WasteTypeCounter,
  WasteLocationCounter,
  PrepareSubscriptionData,
}
