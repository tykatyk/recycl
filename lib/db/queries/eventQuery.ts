//ToDo: Add validation before create and update operations
import { Event } from '../models/index'
import mongoose from 'mongoose'
import { _id } from '@next-auth/mongodb-adapter'

const eventQueries = {
  create: async (data, user) => {
    if (!user) return null

    data.user = user['_id']

    const event = new Event(data)
    return await event.save()
  },

  get: async (id) => {
    const result = await Event.findById(id, {
      __v: 0,
      isActive: 0,
      expires: 0,
      createdAt: 0,
      updatedAt: 0,
    }).exec()
    return result
  },

  getAll: async (queryParams, user) => {
    if (!user) return { total: 0, data: [] }

    const {
      variant = 'active',
      direction = 'prev',
      offset = '',
      pageSize = 0,
    } = queryParams

    type EventQuery = {
      user: mongoose.Types.ObjectId
      _id?: {
        $lt?: mongoose.Types.ObjectId
        $gt?: mongoose.Types.ObjectId
      }
      isActive: Boolean
    }

    const query: EventQuery | {} = {}

    query['user'] = new mongoose.Types.ObjectId(user)

    if (offset) {
      if (direction === 'prev') {
        query['_id'] = {
          $lt: new mongoose.Types.ObjectId(offset),
        }
      }

      if (direction === 'next') {
        query['_id'] = {
          $gt: new mongoose.Types.ObjectId(offset),
        }
      }
    }

    if (variant === 'active') {
      query['isActive'] = true
      query['date'] = {
        $gte: new Date(),
      }
    } else {
      query['$or'] = [{ isActive: false }, { date: { $lt: new Date() } }]
    }

    const events = await Event.find(query)
      .sort({ date: -1 })
      .limit(pageSize)
      .populate('waste')

    const totalItems = await Event.countDocuments(query)

    return { total: totalItems, events }
  },

  update: async (newValue) => {
    return await Event.findByIdAndUpdate(newValue._id, newValue, {
      new: true,
    }).exec()
  },

  delete: async (id) => {
    return await Event.findByIdAndRemove(id).exec()
  },

  deleteMany: async (ids) => {
    return await Event.deleteMany({ _id: { $in: ids } }).exec()
  },
}
export default eventQueries
