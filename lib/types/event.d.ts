import type { PlaceType } from './placeAutocomplete'
import type { Waste } from './waste'
import type { FormikEventValues } from '../validation/eventFormValidator'
import type { Dayjs } from 'dayjs'

export type Variant = 'inactive' | 'active'

export type EventProps = { events: [Event]; variant: Variant }

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
  user: string | { name: string; _id: string }
  location: PlaceType | null
  waste: string | { name: string; _id: string }
  date: Dayjs | null
  phone: string
  comment?: string
}
