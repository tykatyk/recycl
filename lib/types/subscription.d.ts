import type { UserType } from '../db/models/user'

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
  data: WasteRemovalByLocation[]
}

export type SubscribedUser = Pick<
  UserType & { _id: string },
  '_id' | 'name' | 'email'
>

export interface AggregatedApplication {
  userId: mongoose.Types.ObjectId
  docs: [{ locationId: string; locationName: string; wasteTypes: string[] }]
}
