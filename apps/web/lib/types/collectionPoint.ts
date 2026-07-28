import {
  CollectionPointContainer,
  CollectionPointMobile,
  CollectionPointStationery,
} from '@recycl/shared/dist/server/db/models/collectionPoint'

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
    > & { variant: 'container' })
  | (Omit<
      CollectionPointMobile,
      'createdAt' | 'updatedAt' | 'viewedBy' | 'status'
    > & { variant: 'mobile' })
  | (Omit<
      CollectionPointStationery,
      'createdAt' | 'updatedAt' | 'viewedBy' | 'status'
    > & { variant: 'stationery' })
