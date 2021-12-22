import mongoose from 'mongoose'
import cryptoRandomString from 'crypto-random-string'

const Schema = mongoose.Schema

const locationSchema = new Schema({
  required: false,
  description: {
    type: String,
    required: true,
  },
  place_id: {
    type: String,
    required: true,
  },
})
const checkEmail = (v) => {
  const re =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/
  return re.test(String(v))
}
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
        validator: checkEmail,
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
        validator: (v) => {
          const re =
            /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
          return re.test(String(v).toLowerCase())
        },
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
    password: {
      type: String,
      required: true,
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
  this.resetEmailExpires = Date.now() + 3600000 //expires in an hour
}
userSchema.methods.generateEmailConfirm = function (length = 128) {
  this.confirmEmailToken = cryptoRandomString({ length, type: 'url-safe' })
  this.confirmEmailExpires = Date.now() + 3600000 //expires in an hour
}

export default mongoose.models.User || mongoose.model('User', userSchema)
