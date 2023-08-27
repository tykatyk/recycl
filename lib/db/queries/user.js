import { User, RemovalApplication } from '../models/index'
import mapErrors from '../../helpers/mapErrors'
import {
  contactsSchema,
  phoneSchema,
  changePasswordSchema,
} from '../../validation/index.js'
import { compare, hash } from 'bcrypt'
// const { UserInputError } = require('apollo-server-micro')
import { GraphQLError } from 'graphql'

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
        RemovalApplication.deleteMany({ user: id }).exec(),
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

  updateContacts: async (contacts, userInstance) => {
    if (!userInstance) return null
    try {
      await contactsSchema.validate(contacts, { abortEarly: false })
    } catch (error) {
      const mappedErrors = mapErrors(error)
      throw new GraphQLError('Invalid argument value', {
        extenstions: {
          detailedMessages: mappedErrors,
        },
      })
    }

    const user = await User.findById(userInstance.id)
    user.name = contacts.username
    user.location = contacts.location

    return await user.save()
  },

  updatePhone: async (phone, userInstance) => {
    if (!userInstance) return null
    try {
      await phoneSchema.validate({ phone }, { abortEarly: false })
    } catch (error) {
      console.log(error)
      const mappedErrors = mapErrors(error)
      throw new GraphQLError('Invalid argument value', {
        extenstions: {
          detailedMessages: mappedErrors,
        },
      })
    }
    const user = await User.findById(userInstance.id)
    user.phone = phone
    return (await user.save()).phone
  },

  updatePassword: async (oldPassword, newPassword, userInstance) => {
    if (!userInstance) return null
    try {
      await changePasswordSchema.validate(
        { oldPassword, newPassword },
        { abortEarly: false }
      )
    } catch (error) {
      console.log(error)
      const mappedErrors = mapErrors(error)
      throw new GraphQLError('Invalid argument value', {
        extenstions: {
          detailedMessages: mappedErrors,
        },
      })
    }
    const user = await User.findById(userInstance.id)
    let oldPasswordCorrect = false
    if (user && user.password) {
      oldPasswordCorrect = await compare(oldPassword, user.password)
    }

    if (!oldPasswordCorrect) {
      throw new GraphQLError('Invalid argument value', {
        detailedMessages: {
          oldPassword: 'Некорректный пароль',
        },
      })
    }
    user.password = await hash(
      newPassword,
      parseInt(process.env.HASHING_ROUNDS, 10)
    )
    return !!(await user.save())
  },
}
export default userQueries
