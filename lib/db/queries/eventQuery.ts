import { WasteRemovalEventModel } from '../models/index'
import { _id } from '@next-auth/mongodb-adapter'
import {
  eventVariants,
  validSortOrder,
  validOrderBy,
} from '../../helpers/eventHelpers'
import type {
  Variant,
  SortOrder,
  OrderBy,
  HrefOptions,
} from '../../types/event'
const { active } = eventVariants
const { asc, desc } = validSortOrder

interface SelectQuery {
  user: string
  isActive: boolean
}

const getSelectQuery = (variant: Variant, user: string): SelectQuery => {
  const status = variant === active ? true : false
  const selectQuery = { user, isActive: status }

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
    queryParams: HrefOptions & { variant: Variant },
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

    const select = getSelectQuery(variant, user)
    const sort = getSortQuery(sortProperty, sortOrder)
    const skip = pageInt * pageSizeInt

    return await WasteRemovalEventModel.find(select)
      .sort(sort)
      .skip(skip)
      .limit(pageSizeInt)
      .populate('waste')
  },
}
export default eventQueries
