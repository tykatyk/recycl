import { CollectionPointModel } from '@recycl/shared/dist/server/db'
import { validSortOrder, validOrderBy } from '../../helpers/eventHelpers'
import type {
  Variant,
  SortOrder,
  OrderBy,
  PaginationOptions,
} from '../../types/pagination'
const { asc, desc } = validSortOrder

interface SelectQuery {
  user: string
  status: Variant
}

const getSelectQuery = (variant: Variant, user: string): SelectQuery => {
  const selectQuery = { user, status: variant }

  return selectQuery
}

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

const eventQueries = {
  getAll: async (
    queryParams: PaginationOptions & { variant: Variant },
    user: string,
  ) => {
    const {
      page = 0,
      pageSize = 0,
      variant = 'active',
      sortOrder = desc,
      sortProperty,
    } = queryParams

    const pageInt = parseInt(String(page), 10)
    const pageSizeInt = parseInt(String(pageSize), 10)

    if (!user || !variant) return []

    const select = getSelectQuery(variant, user)
    const sort = getSortQuery(sortProperty, sortOrder)
    const skip = Math.max(pageInt - 1, 0) * pageSizeInt

    return await CollectionPointModel.find(select)
      .sort(sort)
      .skip(skip)
      .limit(pageSizeInt)
  },
}
export default eventQueries
