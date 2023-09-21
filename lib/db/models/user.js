import mongoose from 'mongoose'
import cryptoRandomString from 'crypto-random-string'
import {
  phone as phoneValidator,
  email as emailValidator,
} from '../../validation/atomicValidators'

//validates email
const checkEmail = (v) => {
  try {
    return !!emailValidator.validateSync(v)
  } catch (error) {
    return false
  }
}

const Schema = mongoose.Schema

const locationSchema = new Schema({
  description: {
    type: String,
    required: true,
  },
  place_id: {
    type: String,
    required: true,
  },
})

const userSchema = Schema(
  {
    name: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 255,
    },
    location: locationSchema,
    phone: {
      type: String,
      validate: {
        validator: (v) => {
          try {
            return !!phoneValidator.validateSync(v)
          } catch (error) {
            return false
          }
        },
        message: (props) => `${props.value} Недействительный номер телефона!`,
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: checkEmail,
        message: (props) =>
          `${props.value} Недействительный адрес электронной почты!`,
      },
      lowercase: true,
    },
    newEmail: {
      type: String,
      required: false,
      unique: false,
      validate: {
        validator: checkEmail,
        message: (props) =>
          `${props.value} Недействительный адрес электронной почты!`,
      },
      lowercase: true,
    },
    emailConfirmed: {
      type: Boolean,
      required: true,
      default: false,
    },
    image: {
      type: String,
      required: false,
    },
    withPassword: {
      type: Boolean,
      default: true,
      required: true,
    },
    password: {
      type: String,
      required: function () {
        return this.withPassword
      },
      minLength: 6,
      maxLength: 255,
    },
    resetPasswordToken: {
      type: String,
      required: false,
      maxLength: 128,
    },
    resetPasswordExpires: {
      type: Date,
      required: false,
    },
    resetEmailToken: {
      type: String,
      required: false,
      maxLength: 128,
    },
    resetEmailExpires: {
      type: Date,
      required: false,
    },
    confirmEmailToken: {
      type: String,
      required: false,
      maxLength: 128,
    },
    confirmEmailExpires: {
      type: Date,
      required: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isBanned: {
      type: Boolean,
      default: false,
    },
    roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role',
      },
    ],
  },
  { timestamps: true }
)

userSchema.methods.generatePasswordReset = function (length = 32) {
  this.resetPasswordToken = cryptoRandomString({ length, type: 'url-safe' })
  this.resetPasswordExpires = Date.now() + 3600000 //expires in an hour
}
userSchema.methods.generateEmailReset = function (length = 128) {
  this.resetEmailToken = cryptoRandomString({ length, type: 'url-safe' })
  this.resetEmailExpires = Date.now() + 3600000
}
userSchema.methods.generateEmailConfirm = function (length = 128) {
  this.confirmEmailToken = cryptoRandomString({ length, type: 'url-safe' })
  this.confirmEmailExpires = Date.now() + 3600000
}

export default mongoose.models.User || mongoose.model('User', userSchema)
