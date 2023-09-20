import type { PlaceType, RawPlaceType } from './placeAutocomplete'
import type { WasteType } from './waste'

export type EventId = {
  id?: string
}

export type SSProps = {
  props: EventProps
}

export type EventProps = {
  variant: 'inactive' | 'active'
}

export type InitialEventValues = {
  location: string
  wasteType: string
  date: string
  startTime?: string
  endTime?: string
  phone: string
  comment?: string
}

export type RawEventValues = {
  [K in keyof InitialEventValues]: K extends 'location'
    ? RawPlaceType
    : InitialEventValues[K]
}
export type EventValues = {
  [K in keyof RawEventValues]: K extends 'location'
    ? PlaceType
    : K extends 'wasteType'
    ? WasteType
    : RawEventValues[K]
}
