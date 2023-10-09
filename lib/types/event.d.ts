import type { PlaceType } from './placeAutocomplete'
import type { Waste } from './waste'
import type { FormikEventValues } from './../validation/eventForm'
import type { Dayjs } from 'dayjs'

export type Variant = 'inactive' | 'active'

export type EventProps = {
  variant: Variant
}

export type SSProps = {
  props: EventProps
}

export type EventCreateUpdateProps = {
  event?: Event
  wasteTypes?: [Waste]
  userPhone?: string
}
export type Event = {
  _id?: string
  location: PlaceType | null
  waste: string
  date: Dayjs | string
  phone: string
  comment?: string
}
