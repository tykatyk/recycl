import { UserModel as User } from '@recycl/shared/dist/server/db'

const userQueries = {
  getById: async (id, userInstance) => {
    if (!userInstance) return null
    try {
      return await User.findById(id).exec()
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

  deleteMany: async (ids) => {
    try {
      return await User.deleteMany({ _id: { $in: ids } }).exec()
    } catch (error) {
      return error
    }
  },
}
export default userQueries
