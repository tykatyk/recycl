import getCoords from '../../helpers/getCoords'
//import removalApplication from '../../validation/removalApplication' //ToDo: Add validation before create and update operations
import { Event } from '../models/index'
import { internalServerError } from '../../errors/index'
import mongoose from 'mongoose'

const eventQueries = {
  create: async (data, user) => {
    if (!user) return null

    data.user = {}

    try {
      data.user._id = user['_id']
      data.user.name = user.name

      const event = new Event(data)
      return await event.save()
    } catch (error) {
      console.log(error)
      throw internalServerError
    }
  },

  get: async (id) => {
    try {
      const result = await Event.findById(id, {
        __v: 0,
        user: 0,
        isActive: 0,
        expires: 0,
        createdAt: 0,
        updatedAt: 0,
      }).exec()
      return result
    } catch (error) {
      console.log(error)
      // throw internalServerError
    }
  },

  getAll: async (queryParams, user) => {
    try {
      if (!user) return null
      const query = {}

      if (queryParams.wasteType)
        query['wasteType'] = new mongoose.Types.ObjectId(queryParams.wasteType)
      if (queryParams.city) query['wasteLocation.place_id'] = queryParams.city

      return await Event.find(query).populate('wasteType')
    } catch (error) {
      console.log(error)
      throw internalServerError
    }
  },

  update: async (id, newValue) => {
    try {
      return await Event.findByIdAndUpdate(id, newValue, {
        new: true,
      }).exec()
    } catch (error) {
      console.log(error)
      throw internalServerError
    }
  },

  delete: async (id) => {
    try {
      return await Event.findByIdAndRemove(id).exec()
    } catch (error) {
      console.log(error)
      throw internalServerError
    }
  },

  deleteMany: async (ids) => {
    try {
      return await Event.deleteMany({ _id: { $in: ids } }).exec()
    } catch (error) {
      console.log(error)
      throw internalServerError
    }
  },
}
export default eventQueries
