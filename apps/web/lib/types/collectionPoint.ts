import {
  CollectionPointContainer,
  CollectionPointMobile,
  CollectionPointStationery,
} from '@recycl/shared/dist/server/db/models/collectionPoint'
import type { CollectionPointVariant } from '@recycl/shared/dist/constants'

export type IsInactive = {
  isInactive?: '1'
}

export type AdActions = {
  activate: 'activate'
  deactivate: 'deactivate'
  remove: 'remove'
}

export type CollectionPoint =
  | (Omit<
      CollectionPointContainer,
      'createdAt' | 'updatedAt' | 'viewedBy' | 'status'
    > & { variant: Extract<CollectionPointVariant, 'container'> })
  | (Omit<
      CollectionPointMobile,
      'createdAt' | 'updatedAt' | 'viewedBy' | 'status'
    > & { variant: Extract<CollectionPointVariant, 'mobile'> })
  | (Omit<
      CollectionPointStationery,
      'createdAt' | 'updatedAt' | 'viewedBy' | 'status' | 'receiveParcels'
    > & { variant: Extract<CollectionPointVariant, 'stationery'> })
