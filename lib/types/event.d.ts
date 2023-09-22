import type { PlaceType, NormalizedPlaceType } from './placeAutocomplete'
import type { WasteType } from './waste'
import type { FormikEventValues } from './../validation/eventForm'

export type EventId = {
  id?: string
}

export type SSProps = {
  props: EventProps
}

export type EventProps = {
  variant: 'inactive' | 'active'
}

export type EventValues = {
  location: PlaceType | null
  wasteType: string
  date: string
  startTime?: string
  endTime?: string
  phone: string
  comment?: string
}

export type NormalizedEventValues = {
  [K in keyof InitialEventValues]: K extends 'location'
    ? NormalizedPlaceType
    : K extends 'wasteType'
    ? WasteType
    : InitialEventValues[K]
}
