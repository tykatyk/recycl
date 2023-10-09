//ToDo: Add validation before create and update operations
import { Event } from '../models/index'
import mongoose from 'mongoose'

const eventQueries = {
  create: async (data, user) => {
    if (!user) return null

    data.user = {}

    data.user._id = user['_id']
    data.user.name = user.name

    const event = new Event(data)
    return await event.save()
  },

  get: async (id) => {
    const result = await Event.findById(id, {
      __v: 0,
      user: 0,
      isActive: 0,
      expires: 0,
      createdAt: 0,
      updatedAt: 0,
    }).exec()
    return result
  },

  getAll: async (queryParams, user) => {
    if (!user) return null
    const query = {}

    if (queryParams.wasteType)
      query['wasteType'] = new mongoose.Types.ObjectId(queryParams.wasteType)
    if (queryParams.city) query['wasteLocation.place_id'] = queryParams.city

    return await Event.find(query).populate('wasteType')
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
