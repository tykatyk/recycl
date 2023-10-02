import type { PlaceType } from './placeAutocomplete'
import type { WasteType } from './waste'
import type { FormikEventValues } from './../validation/eventForm'

/*export type EventId = {
  id?: string
}*/

export type Variant = 'inactive' | 'active'

export type EventProps = {
  variant: Variant
}

export type SSProps = {
  props: EventProps
}

export type EventValues = {
  location: PlaceType | null
  wasteType: WasteType | string
  date: string
  startTime?: string
  endTime?: string
  phone: string
  comment?: string
}

export type InitialEventData = {
  event?: EventValues
}

/*export type NormalizedEventValues = {
  [K in keyof InitialEventValues]: K extends 'location'
    ? NormalizedPlaceType
    : K extends 'wasteType'
    ? WasteType
    : InitialEventValues[K]
}*/
