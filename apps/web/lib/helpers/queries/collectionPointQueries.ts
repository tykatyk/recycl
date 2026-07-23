import { CollectionPointModel } from '@recycl/shared/dist/server/db'
import { validSortOrder, validOrderBy } from '../eventHelpers'
import type {
  SortOrder,
  OrderBy,
  PaginationOptions,
} from '../../types/pagination'
import { collectionPointTypes } from '@recycl/shared/dist/constants'
const { asc, desc } = validSortOrder

type SortOption = -1 | 1

interface SortQuery {
  [key: string]: SortOption
}

const getSortQuery = (
  sortProperty: OrderBy | '_id' = '_id',
  sortOrder: SortOrder = desc,
): SortQuery => {
  const sortQuery: SortQuery = {}
  const sort = sortOrder === asc ? 1 : -1

  if (sortProperty === validOrderBy.location) {
    sortQuery['location.description'] = sort
  } else {
    sortQuery[sortProperty] = sort
  }

  sortQuery['_id'] = -1

  return sortQuery
}

const collectionPointsQueries = {
  getAll: async (
    queryParams: PaginationOptions & {
      variant: keyof typeof collectionPointTypes
    },
    user: string,
  ) => {
    const {
      page = 0,
      pageSize = 0,
      variant,
      sortOrder = desc,
      sortProperty,
    } = queryParams

    const pageInt = parseInt(String(page), 10)
    const pageSizeInt = parseInt(String(pageSize), 10)

    if (!user || !variant) return []

    const sort = getSortQuery(sortProperty, sortOrder)
    const skip = Math.max(pageInt - 1, 0) * pageSizeInt

    return await CollectionPointModel.find({ user, variant })
      .sort(sort)
      .skip(skip)
      .limit(pageSizeInt)
  },
}
export default collectionPointsQueries
