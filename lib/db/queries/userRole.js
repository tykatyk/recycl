import { UserRole } from '../models'
console.log('enter userRole dbQuery')
export default {
  create: async (data) => {
    try {
      return await new UserRole(data).save()
    } catch (err) {
      return err
    }
  },

  get: async (id) => {
    try {
      return await UserRole.findById(id).exec()
    } catch (err) {
      return err
    }
  },
  getByName: async (roleName) => {
    try {
      const id = (
        await UserRole.findOne({ name: roleName }, { _id: 1 }).exec()
      )['_id']
      return id
    } catch (err) {
      console.log('error in db query')
      return err
    }
  },

  getAll: async () => {
    try {
      return await UserRole.find()
    } catch (err) {
      return err
    }
  },

  update: async (id, values) => {
    try {
      return await UserRole.findByIdAndUpdate(id, values, {
        new: true,
      }).exec()
    } catch (err) {
      return err
    }
  },

  delete: async (id) => {
    try {
      return await UserRole.findByIdAndRemove(id).exec()
    } catch (err) {
      return err
    }
  },

  deleteMany: async (ids) => {
    try {
      return await UserRole.deleteMany({ _id: { $in: ids } }).exec()
    } catch (err) {
      return err
    }
  },
}
