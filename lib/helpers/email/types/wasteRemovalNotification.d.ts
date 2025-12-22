export interface Agent {
  agentId: Types.ObjectId
  agentName: string
  date: Date
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
