import type { UserType } from '../db/models/user'
import { unsubscribeApiResponseCodes } from './unsubscribeApiResponseCodes'
import { Types } from 'mongoose'
import type { Email } from './email'
import { subscriptionVariantNames } from '../helpers/subscriptions'
const { wasteAvailable, wasteRemoval } = subscriptionVariantNames

export interface EventByWasteType {
  eventId: string
  agentName: string
  date: string
}

export interface WasteRemovalEvents {
  wasteType: string
  eventsByWasteType: EventByWasteType[]
}

export interface WasteRemovalByLocation {
  locationId: string
  locationName: string
  eventsByLocation: WasteRemovalEvents[]
}

export type AggregatedRemovalApplication = {
  locationId: string
  locationName: string
  wasteTypes: string[]
}

export interface AggregatedApplicationPerUser {
  userId: mongoose.Types.ObjectId
  docs: AggregatedRemovalApplication[]
}

export interface WasteRemovalNotification {
  receiverEmail: string
  receiverName: string
  unsubscribeToken: string
  listUnsubscribeToken: string
  data: WasteRemovalByLocation[]
}

export type SubscribedUser = Pick<
  UserType & { _id: Types.ObjectId },
  '_id' | 'name' | 'email' | 'isBanned' | 'isActive'
>

const {
  SUCCESS,
  TOKEN_NOT_FOUND,
  TOKEN_EXPIRED,
  USER_NOT_FOUND,
  SUBSCRIPTION_NOT_FOUND,
  TOKEN_USED,
} = unsubscribeApiResponseCodes

export type UnsubscribeApiResponse = {
  status:
    | typeof SUCCESS
    | typeof TOKEN_NOT_FOUND
    | typeof TOKEN_EXPIRED
    | typeof USER_NOT_FOUND
    | typeof SUBSCRIPTION_NOT_FOUND
    | typeof TOKEN_USED
}

export type SubscriptionVariantName =
  | typeof wasteAvailable
  | typeof wasteRemoval

export type SendSubscriptionEmailJobData = {
  runId: string
  batchId: string
  subscriptionVariantName: SubscriptionVariantNames
}

export type PrepareSubscriptionRunJobData = {
  runId: string
  subscriptionVariantName: SubscriptionVariantNames
  userId?: string
  totalRecipients?: number
}

export type EnsureUsersSubscribedJobData = {
  offset: number
  limit: number
}

export type WasteTypeCounter = { wasteName: string; newAdsCount: number }

export type WasteLocationCounter = {
  locationName: string
  locationId: string
  adCounters: WasteTypeCounter[]
}

export type PrepareSubscriptionData = {
  subscriptionName: SubscriptionVariantName
  userName: string
  userEmail: string
  userId: string
  lastRunDate: Date
}
