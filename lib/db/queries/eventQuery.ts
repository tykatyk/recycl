import { Event } from '../models/index'
import { _id } from '@next-auth/mongodb-adapter'
import { eventVariants } from '../../helpers/eventHelpers'
import type { Variant, Direction } from '../../types/event'
const { active } = eventVariants

type QueryParams = {
  variant?: Variant
  direction?: Direction
  offset?: string
  offsetDate?: string
  pageSize?: number
}

const getQuery = (queryParams: Omit<QueryParams, 'pageSize'>, user: string) => {
  const {
    variant = active,
    direction,
    offset = '',
    offsetDate = '',
  } = queryParams

  const query = {}

  query['user'] = user

  if (offset) {
    if (direction === 'prev') {
      if (variant === 'active') {
        //prev active
        query['isActive'] = true
        query['_id'] = { $gt: offset }
        query['$and'] = [
          { date: { $gte: new Date(offsetDate) } },
          { date: { $gte: new Date() } },
        ]
      } else {
        //prev inactive
        query['$or'] = [
          {
            isActive: false,
            _id: { $gt: offset },
            date: {
              $gte: new Date(offsetDate),
            },
          },
          {
            isActive: true,
            _id: { $gt: offset },
            date: {
              $and: [{ $gte: new Date(offsetDate) }, { $lt: new Date() }],
            },
          },
        ]
      }
    } else {
      if (variant === 'active') {
        //next active
        query['isActive'] = true
        query['_id'] = { $lt: offset }
        query['$and'] = [
          { date: { $lte: new Date(offsetDate) } },
          { date: { $gte: new Date() } },
        ]
      } else {
        //next inactive
        query['$or'] = [
          {
            isActive: false,
            _id: { $lt: offset },
            date: {
              $lte: new Date(offsetDate),
            },
          },
          {
            isActive: true,
            _id: { $lt: offset },
            date: {
              $and: [{ $lte: new Date(offsetDate) }, { $lt: new Date() }],
            },
          },
        ]
      }
    }
  } else {
    if (variant === active) {
      query['isActive'] = true
      query['date'] = {
        $gte: new Date(),
      }
    } else {
      query['$or'] = [{ isActive: false }, { date: { $lt: new Date() } }]
    }
  }
  return query
}

const getCountQuery = (
  queryParams: Pick<QueryParams, 'variant'>,
  user: string,
) => {
  let countQuery = { user }

  if (queryParams.variant === active) {
    countQuery['$and'] = [{ isActive: true }, { date: { $gt: new Date() } }]
  } else {
    countQuery['$or'] = [{ isActive: false }, { date: { $lt: new Date() } }]
  }
  return countQuery
}

const getSortQuery = (direction?: Direction) => {
  let sortQuery = {}

  if (direction === 'prev') {
    sortQuery['date'] = 1
    sortQuery['_id'] = 1
  } else {
    sortQuery['date'] = -1
    sortQuery['_id'] = -1
  }
  console.log(sortQuery)
  return sortQuery
}

const eventQueries = {
  getAll: async (queryParams: QueryParams, user: string) => {
    if (!user) return { total: 0, data: [] }

    const { pageSize = 0, ...rest } = queryParams

    const query = getQuery(rest, user)
    const countQuery = getCountQuery(rest, user)
    const sortQuery = getSortQuery(queryParams.direction)

    let events = await Event.find(query)
      .sort(sortQuery)
      .limit(pageSize)
      .populate('waste')

    if (queryParams.direction == 'prev') events = events.reverse()

    const totalItems = await Event.countDocuments(countQuery)

    return { total: totalItems, events }
  },
}
export default eventQueries
