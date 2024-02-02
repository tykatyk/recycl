import { Event } from '../models/index'
import { _id } from '@next-auth/mongodb-adapter'
import { eventVariants } from '../../helpers/eventHelpers'
import type { Variant, Direction, Event as EventType } from '../../types/event'
const { active } = eventVariants

type Sort = 'date' | 'wasteType' | 'location'

type QueryParams = {
  variant?: Variant
  direction?: Direction
  page?: string
  pageSize?: string
  sortOrder?: Sort
}

interface SelectQuery {
  user: string
  isActive: boolean
}

const getSelectQuery = (variant: Variant, user: string): SelectQuery => {
  const status = variant === active ? true : false
  const selectQuery = { user, isActive: status }

  return selectQuery
}

interface CountQuery {
  user: string
  isActive: boolean
}
const getCountQuery = (variant: Variant, user: string): CountQuery => {
  const status = variant === active ? true : false
  let countQuery: CountQuery = { user, isActive: status }

  return countQuery
}

type SortOption = -1 | 1

interface SortQuery {
  [key: string]: SortOption
}

const getSortQuery = (sort?: Sort): SortQuery => {
  const sortQuery: SortQuery = { _id: -1 }

  if (!sort) sortQuery['date'] = -1

  return sortQuery
}

const eventQueries = {
  getAll: async (queryParams: QueryParams, user: string) => {
    const result: {
      total: number
      events: EventType[]
      currentPage: number
    } = {
      total: 0,
      events: [],
      currentPage: 0,
    }
    const { page = 0, pageSize = 0, variant, sortOrder = 'date' } = queryParams

    const pageInt = parseInt(String(page), 10)
    const pageSizeInt = parseInt(String(pageSize), 10)

    if (!user || !variant) return result

    const select = getSelectQuery(variant, user)
    const countAll = getCountQuery(variant, user)
    const sort = getSortQuery(sortOrder)

    const total = await Event.countDocuments(countAll)
    let skip = pageInt * pageSizeInt

    if (total === 0) return result

    if (skip > total) skip = total - pageSizeInt
    if (skip < 0) skip = 0

    const events: EventType[] = await Event.find(select)
      .sort(sort)
      .skip(skip)
      .limit(pageSizeInt)
      .populate('waste')

    const currentPage = Math.ceil(skip / pageSizeInt)

    result.total = total
    result.events = events
    result.currentPage = currentPage

    return result
  },
}
export default eventQueries
