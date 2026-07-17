import type { PlaceType } from './placeAutocomplete'
import type { Waste } from './waste'

type CollectionPointVariant = 'stationery' | 'mobile' | 'container'

export interface CollectionPointBase {
  user: string
  location: PlaceType
  waste: string[]
  viewCount: number
  phone: string
  comment?: string
}

export interface CollectionPointMobile extends CollectionPointBase {
  variant: 'mobile'
  date: Date
}
export interface CollectionPointStationery extends CollectionPointBase {
  variant: 'stationery'
}
export interface CollectionPointContainer extends CollectionPointBase {
  variant: 'container'
}

export type CollectionPoint =
  | CollectionPointStationery
  | CollectionPointMobile
  | CollectionPointContainer

export type CollectionPointContainerProps = {
  collectionPoint?: CollectionPointContainer & { _id: string }
  wasteTypes?: [Waste]
  userPhone?: string
}
// export type EventCreateUpdateProps = {
//   event?: CollectionPoint & { _id: string }
//   wasteTypes?: [Waste]
//   userPhone?: string
// }

// export type CollectionPoint = {
//   _id?: string
//   user: string | { name: string; _id: string }
//   location: PlaceType | null
//   waste: string[]
//   date: Dayjs | null
//   phone: string
//   comment?: string
//   viewCount?: number
//   variant: 'stationery' | 'mobile' | 'sortingContainer'
// }

export type IsInactive = {
  isInactive?: '1'
}

export type AdActions = {
  activate: 'activate'
  deactivate: 'deactivate'
  remove: 'remove'
}
