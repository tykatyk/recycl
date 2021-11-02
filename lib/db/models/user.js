import mongoose from 'mongoose'
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
    password: {
      type: String,
      required: true,
      minLength: 6,
      maxLength: 255,
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
export default mongoose.models.User || mongoose.model('User', userSchema)
