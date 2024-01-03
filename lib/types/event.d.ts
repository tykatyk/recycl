import type { PlaceType } from './placeAutocomplete'
import type { Waste } from './waste'
import type { FormikEventValues } from '../validation/eventFormValidator'
import type { Dayjs } from 'dayjs'

export type Variant = 'inactive' | 'active'

export type Direction = 'prev' | 'next'

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
  viewCount?: number
}

export type IsInactive = {
  isInactive?: '1'
}

export type EventActions = {
  activate: 'activate'
  deactivate: 'deactivate'
  remove: 'remove'
}
