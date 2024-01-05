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
  dateTimeBound?: string
}

const getQuery = (queryParams: Omit<QueryParams, 'pageSize'>, user: string) => {
  const {
    variant = active,
    direction,
    offset = '',
    offsetDate = '',
    dateTimeBound,
  } = queryParams

  const query = {}
  query['user'] = user

  if (!dateTimeBound) return query

  if (offset) {
    query['updatedAt'] = { $lte: new Date(dateTimeBound) }

    if (direction === 'prev') {
      if (variant === 'active') {
        //prev active
        query['isActive'] = true
        query['$or'] = [
          {
            $and: [{ _id: { $gt: offset } }, { date: new Date(offsetDate) }],
          },
          { date: { $gt: new Date(offsetDate) } },
        ]
      } else {
        //prev inactive
        query['$or'] = [
          {
            $and: [
              { _id: { $gt: offset } },
              {
                date: new Date(offsetDate),
              },
            ],
          },
          {
            $and: [
              { date: { $gt: new Date(offsetDate) } },
              { date: { $lt: new Date(dateTimeBound) } },
            ],
          },
          {
            $and: [
              { isActive: false },
              { date: { $gt: new Date(dateTimeBound) } },
            ],
          },
        ]
      }
    } else {
      if (variant === 'active') {
        //next active
        query['isActive'] = true
        query['$or'] = [
          {
            $and: [{ _id: { $lt: offset } }, { date: new Date(offsetDate) }],
          },
          {
            $and: [
              { date: { $lt: new Date(offsetDate) } },
              { date: { $gte: new Date(dateTimeBound) } },
            ],
          },
        ]
      } else {
        //next inactive
        query['$or'] = [
          {
            $and: [
              { _id: { $lt: offset } },
              {
                date: new Date(offsetDate),
              },
            ],
          },
          {
            date: { $lt: new Date(offsetDate) },
          },
        ]
      }
    }
  } else {
    if (variant === active) {
      query['isActive'] = true
      query['date'] = {
        $gte: new Date(dateTimeBound),
      }
    } else {
      query['$or'] = [
        { isActive: false },
        {
          $and: [
            { isActive: true },
            { date: { $lt: new Date(dateTimeBound) } },
          ],
        },
      ]
      // query['date'] = { $lt: new Date(dateTimeBound) }
    }
  }
  console.log(new Date(dateTimeBound))
  console.log(query)
  return query
}

const getCountQuery = (
  queryParams: Pick<QueryParams, 'variant' | 'dateTimeBound'>,
  user: string,
) => {
  let countQuery = { user }
  const { dateTimeBound } = queryParams

  if (!dateTimeBound) return countQuery

  if (queryParams.variant === active) {
    countQuery['$and'] = [
      { isActive: true },
      { date: { $gte: new Date(dateTimeBound) } },
      { updatedAt: { $lte: new Date(dateTimeBound) } },
    ]
  } else {
    countQuery['$or'] = [
      {
        isActive: false,
        $and: [
          { date: { $gte: new Date(dateTimeBound) } },
          { updatedAt: { $lte: new Date(dateTimeBound) } },
        ],
      },
      {
        date: { $lt: new Date(dateTimeBound) },
        updatedAt: { $lte: new Date(dateTimeBound) },
      },
    ]
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
