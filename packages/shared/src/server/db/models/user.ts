import mongoose, { type InferSchemaType, type ValidatorProps } from 'mongoose'
import cryptoRandomString from 'crypto-random-string'
import { checkEmail, contactPhone } from '../dbModelCommons.js'
import {
  userRoles,
  CHANGE_EMAIL_EXPIRATION_PERIOD,
  documentActivityStatus,
} from '../../../constants.js'
import { validationMessages } from '../../../validation/index.js'

const { models, model } = mongoose

const { email: invalidEmailAddress } = validationMessages

const { active, blocked } = documentActivityStatus

interface UserMethods {
  generateEmailReset(length?: number): void
}

const methods = {
  generateEmailReset: function (length = 128) {
    this.resetEmailToken = cryptoRandomString({ length, type: 'url-safe' })
    this.resetEmailExpires = new Date(
      Date.now() + CHANGE_EMAIL_EXPIRATION_PERIOD * 60 * 1000,
    )
  },
} satisfies UserMethods

const locationSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
  },
  place_id: {
    type: String,
    required: true,
  },
})

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 255,
    },
    location: locationSchema,
    phone: contactPhone,
    email: {
      type: String,
      required: true, //ToDo: email can be undefined if user is authenticated with OAuth
      unique: true,
      validate: {
        validator: checkEmail,
        message: (props: ValidatorProps) =>
          `${props.value} invalidEmailAddress`,
      },
      lowercase: true,
      trim: true,
    },
    newEmail: {
      type: String,
      required: false,
      unique: false,
      validate: {
        validator: checkEmail,
        message: (props: ValidatorProps) =>
          `${props.value} ${invalidEmailAddress}`,
      },
      lowercase: true,
    },
    emailVerified: {
      type: Date,
      default: null,
    },
    image: {
      type: String,
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
    status: {
      type: String,
      Enum: [active, blocked],
      default: 'active',
      required: true,
    },
    statusChangeReason: {
      type: String,
    },
    roles: [
      {
        type: String,
        Enum: Object.keys(userRoles),
        default: [userRoles.user],
      },
    ],
  },
  {
    timestamps: true,
    methods,
  },
)

userSchema.index({
  email: 1,
})
userSchema.index({
  phone: 1,
})
userSchema.index({
  status: 1,
})

export type User = InferSchemaType<typeof userSchema>

type UserModel = mongoose.Model<User, {}, UserMethods>
const UserModel =
  (models.User as UserModel) || model<User, UserModel>('User', userSchema)

export default UserModel
