import mongoose from 'mongoose'
const Schema = mongoose.Schema

//WasteType
const wasteTypeSchema = Schema(
  {
    name: String,
  },
  { timestamps: true }
)
export const WasteType =
  mongoose.models.WasteType || mongoose.model('WasteType', wasteTypeSchema)

//RemovalApplication
const removalApplicationSchema = Schema(
  {
    wasteLocation: {
      description: String,
      place_id: String,
      structured_formatting: {
        main_text: String,
        main_text_matched_substrings: [
          {
            length: Number,
            offset: Number,
          },
        ],
        secondary_text: String,
      },
    },
    wasteType: {
      type: Schema.Types.ObjectId,
      ref: 'WasteType',
    },
    quantity: Number,
    passDocumet: Boolean,
    comment: String,
    notificationCities: [{ description: String, place_id: String }],
    notificationCitiesCheckbox: Boolean,
    notificationRadius: String,
    notificationRadiusCheckbox: Boolean,
  },
  { timestamps: true }
)

export const RemovalApplication =
  mongoose.models.RemovalApplication ||
  mongoose.model('RemovalApplication', removalApplicationSchema)

//Message
const messageSchema = Schema(
  {
    message: String,
    aplId: { type: Schema.Types.ObjectId, ref: 'RemovalApplication' },
  },
  { timestamps: true }
)
export const Message =
  mongoose.models.Message || mongoose.model('Message', messageSchema)

//User
const userSchema = Schema(
  {
    login: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 20,
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
          `${props.value} не действительный адрес электронной почты!`,
      },
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minLength: 6,
      maxLength: 255,
    },
    isActive: Boolean,
    roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role',
      },
    ],
  },
  { timestamps: true }
)
export const User = mongoose.models.User || mongoose.model('User', userSchema)
