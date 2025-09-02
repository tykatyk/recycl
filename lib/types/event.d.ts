import type { PlaceType } from './placeAutocomplete'
import type { Waste } from './waste'
import type { FormikEventValues } from '../validation/eventFormValidator'
import type { Dayjs } from 'dayjs'

export type Variant = 'inactive' | 'active'
export type SortOrder = 'asc' | 'desc'
export type OrderBy = 'date' | 'waste' | 'location' | 'createdAt'

export type PaginationOptions = {
  page?: string
  pageSize?: string
  sortProperty?: OrderBy
  sortOrder?: SortOrder
}

export type HrefOptions = Omit<PaginationOptions, 'page' | 'pageSize'> & {
  page?: number
  pageSize?: number
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

export type AdActions = {
  activate: 'activate'
  deactivate: 'deactivate'
  remove: 'remove'
}
