type AggregatedRemovalApplication = {
  locationId: string
  locationName: string
  wasteTypes: string[]
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

type WasteTypeCounter = { wasteName: string; newAdsCount: number }

type WasteLocationCounter = {
  locationName: string
  locationId: string
  adCounters: WasteTypeCounter[]
}

type PrepareSubscriptionData = {
  subscriptionName: SubscriptionVariantName
  userName: string
  userEmail: string
  data: WasteLocationCounter[]
}

export type {
  AggregatedRemovalApplication,
  SubscriptionVariantName,
  SendSubscriptionEmailJobData,
  PrepareSubscriptionRunJobData,
  EnsureUsersSubscribedJobData,
  WasteTypeCounter,
  WasteLocationCounter,
  PrepareSubscriptionData,
}
