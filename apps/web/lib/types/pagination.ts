import { documentActivityStatus } from '@recycl/shared/dist/constants'
// export type Variant = 'inactive' | 'active'
export type Variant = keyof typeof documentActivityStatus
export type SortOrder = 'asc' | 'desc'
export type OrderBy = 'date' | 'waste' | 'location' | 'createdAt'

export type PaginatedData<T> = {
  items: T[]
  pagination: {
    total: number
    page: number
    pageSize: number
  }
}

export type PaginationOptions = {
  page?: number
  pageSize?: number
  sortProperty?: OrderBy
  sortOrder?: SortOrder
}

export type HrefOptions = {
  page: number
  pageSize: number
}
