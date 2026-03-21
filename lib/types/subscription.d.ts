import type { UserType } from '../db/models/user'
import { unsubscribeApiResponseCodes } from './unsubscribeApiResponseCodes'
import { Types } from 'mongoose'

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

export interface AggregatedApplication {
  userId: mongoose.Types.ObjectId
  docs: [{ locationId: string; locationName: string; wasteTypes: string[] }]
}

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

export type SubscriptionRunJobData = {
  runId: string
}

export type PrepareSubscriptionRunJobData = {
  runId: string
  subscriptionVariantId: string
  userId?: string
  lastRunDate?: Date
}
export type EnsureUsersSubscribedJobData = {
  offset: number
  limit: number
}

export type WasteTypeCounters = { wasteName: string; newAdsCount: number }
export type Location = { name: string; wasteTypes: WasteTypeCounters[] }
export type WasteAvailableSubscriptionData = {
  receiverName: string
  receiverEmail: string
  locations: Location[]
}
