import { User } from '../models'

export default {
  create: async (data) => {
    try {
      return await new User(data).save()
    } catch (err) {
      console.log(err)
      return err
    }
  },

  get: async (id) => {
    try {
      return await User.findById(id).exec()
    } catch (err) {
      return err
    }
  },

  exists: async (email) => {
    try {
      const user = await User.findOne({ email }).exec()
      if (user) return true
      return false
    } catch (err) {
      return err
    }
  },

  getAll: async () => {
    try {
      return await User.find()
    } catch (err) {
      return err
    }
  },

  update: async (id, values) => {
    try {
      return await User.findByIdAndUpdate(id, values, {
        new: true,
      }).exec()
    } catch (err) {
      return err
    }
  },

  delete: async (id) => {
    try {
      return await User.findByIdAndRemove(id).exec()
    } catch (err) {
      return err
    }
  },

  deleteMany: async (ids) => {
    try {
      return await User.deleteMany({ _id: { $in: ids } }).exec()
    } catch (err) {
      return err
    }
  },
}
