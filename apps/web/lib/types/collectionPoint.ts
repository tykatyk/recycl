import type { PlaceType } from './placeAutocomplete'
import type { Waste } from './waste'
import type { Dayjs } from 'dayjs'

export type EventCreateUpdateProps = {
  event?: CollectionPoint
  wasteTypes?: [Waste]
  userPhone?: string
}

export type CollectionPoint = {
  _id?: string
  user: string | { name: string; _id: string }
  location: PlaceType | null
  waste: string[] | { name: string; _id: string }[]
  date: Dayjs | null
  phone: string
  comment?: string
  viewCount?: number
  collectionPointType: 'stationery' | 'mobile' | 'sortingContainer' | ''
}

export type IsInactive = {
  isInactive?: '1'
}

export type AdActions = {
  activate: 'activate'
  deactivate: 'deactivate'
  remove: 'remove'
}
