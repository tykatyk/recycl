import { User } from '../models'
import mapErrors from '../../mapErrors'
import { contactsSchema } from '../../validation'
const { UserInputError } = require('apollo-server-micro')

export default {
  create: async (data) => {
    try {
      let user = await new User(data).save()
      return user['_id']
    } catch (error) {
      console.log(error)
      return error
    }
  },

  get: async (id) => {
    try {
      return await User.findById(id).exec()
    } catch (error) {
      return error
    }
  },

  getByEmail: async (email) => {
    try {
      return await User.findOne({ email }).exec()
    } catch (error) {
      return error
    }
  },
  getByToken: async (token) => {
    try {
      return await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() },
      }).exec()
    } catch (error) {
      return error
    }
  },

  getAll: async () => {
    try {
      return await User.find()
    } catch (error) {
      return error
    }
  },

  update: async (id, values) => {
    try {
      return await User.findByIdAndUpdate(id, values, {
        new: true,
      }).exec()
    } catch (error) {
      return error
    }
  },

  delete: async (id) => {
    try {
      return await User.findByIdAndRemove(id).exec()
    } catch (error) {
      return error
    }
  },

  deleteMany: async (ids) => {
    try {
      return await User.deleteMany({ _id: { $in: ids } }).exec()
    } catch (error) {
      return error
    }
  },

  updateContacts: async (contacts, userInstance) => {
    try {
      await contactsSchema.validate(contacts, { abortEarly: false })
    } catch (error) {
      const mappedErrors = mapErrors(error)
      throw new UserInputError('Invalid argument value', {
        detailedMessages: mappedErrors,
      })
    }

    userInstance.name = contacts.username
    userInstance.location = contacts.location
    return await userInstance.save()
  },
}
