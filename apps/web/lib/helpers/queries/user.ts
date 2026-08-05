import { UserModel as User, AdModel } from '@recycl/shared/dist/server/db'

const userQueries = {
  create: async (data) => {
    try {
      let user = await new User(data)
      user.withPassword = true
      user.generateEmailConfirm()
      return await user.save()
    } catch (error) {
      console.log(error)
      return error
    }
  },

  getById: async (id, userInstance) => {
    if (!userInstance) return null
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

  delete: async (user) => {
    if (!user.id) return null
    const id = user.id
    try {
      Promise.all([
        AdModel.deleteMany({ user: id }).exec(),
        User.findByIdAndRemove(id).exec(),
      ])
        .then((result) => {
          const [user] = result
          return user
        })
        .catch((error) => {
          console.log(error)
          return error
        })
    } catch (error) {}
  },

  deleteNotConfirmedUser: async (id) => {
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
}
export default userQueries
