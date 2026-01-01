import type { UserType } from '../db/models/user'

export interface Agent {
  agentId: Types.ObjectId
  agentName: string
  date: string
}

export interface WasteRemovalEvents {
  [wasteName: string]: Agent[]
}

export interface WasteRemovalByLocation {
  [locationId: string]: {
    locationName: string
    wasteRemovalEvents: WasteRemovalEvents
  }
}

export interface WasteRemovalNotification {
  receiverEmail: string
  receiverName: string
  locations: WasteRemovalByLocation
}

export type SubscribedUser = Pick<
  UserType & { _id: string },
  '_id' | 'name' | 'email'
>

export interface EventByWasteType {
  wasteType: string
  agents: Agent[]
}

export interface AggregatedApplication {
  userId: mongoose.Types.ObjectId
  docs: [{ locationId: string; locationName: string; wasteTypes: string[] }]
}

export interface AggregatedEvent {
  locationId: string
  locationName: string
  eventsByWasteType: EventByWasteType[]
}
