import { User } from '../models'

export default {
  create: async (data) => {
    try {
      console.log('Mongodb user create entered. Data is ')
      console.log(data)
      return await new User(data).save()
    } catch (err) {
      console.log('Mongodb error ')
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
