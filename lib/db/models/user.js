import mongoose from 'mongoose'
import cryptoRandomString from 'crypto-random-string'

const Schema = mongoose.Schema

const userSchema = Schema(
  {
    username: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 255,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (v) => {
          const re =
            /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
          return re.test(String(v).toLowerCase())
        },
        message: (props) =>
          `${props.value} недействительный адрес электронной почты!`,
      },
      lowercase: true,
    },
    emailVerified: {
      type: Boolean,
      required: false,
    },
    image: {},
    password: {
      type: String,
      required: true,
      minLength: 6,
      maxLength: 255,
    },
    resetPasswordToken: {
      type: String,
      required: false,
    },
    resetPasswordExpires: {
      type: Date,
      required: false,
    },
    isActive: {
      type: Boolean,
      default: true,
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

userSchema.methods.generatePasswordReset = function () {
  this.resetPasswordToken = cryptoRandomString({ length: 32, type: 'url-safe' })
  this.resetPasswordExpires = Date.now() + 3600000 //expires in an hour
}

export default mongoose.models.User || mongoose.model('User', userSchema)
