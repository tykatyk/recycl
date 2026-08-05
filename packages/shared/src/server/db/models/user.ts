import { Schema, models, model, InferSchemaType, Model } from 'mongoose'
import type { ValidatorProps } from 'mongoose'
import cryptoRandomString from 'crypto-random-string'
import { phone as phoneValidator } from '../../../validation/atomicValidators'
import { checkEmail } from '../dbModelCommons'
import { documentActivityStatus } from '../../../constants'
import { validationMessages } from '../../../validation'
import { CHANGE_EMAIL_EXPIRATION_PERIOD } from '../../../constants'

const { email: invalidEmailAddress, phone: invalidPhoneNumber } =
  validationMessages

const { active, blocked } = documentActivityStatus

interface UserMethods {
  generateEmailReset(length?: number): void
  generateEmailConfirm(length?: number): void
}

const methods = {
  generateEmailReset: function (length = 128) {
    this.resetEmailToken = cryptoRandomString({ length, type: 'url-safe' })
    this.resetEmailExpires = new Date(
      Date.now() + CHANGE_EMAIL_EXPIRATION_PERIOD,
    )
  },
  generateEmailConfirm: function (length = 128) {
    this.confirmEmailToken = cryptoRandomString({
      length,
      type: 'url-safe',
    })
    this.confirmEmailExpires = new Date(
      Date.now() + CHANGE_EMAIL_EXPIRATION_PERIOD,
    )
  },
} satisfies UserMethods

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

const userSchema = new Schema(
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
        validator: (v: string) => {
          try {
            return !!phoneValidator.validateSync(v)
          } catch (error) {
            return false
          }
        },
        message: (props: ValidatorProps) => `${props.value} invalidPhoneNumber`,
      },
    },
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
      index: true,
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
    emailConfirmed: {
      type: Boolean,
      required: true,
      default: false,
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
    confirmEmailToken: {
      type: String,
      required: false,
      maxLength: 128,
    },
    confirmEmailExpires: {
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
        type: Schema.Types.ObjectId,
        ref: 'Role',
      },
    ],
  },
  {
    timestamps: true,
    methods,
  },
)

export type User = InferSchemaType<typeof userSchema>

type UserModel = Model<User, {}, UserMethods>
const UserModel =
  (models.User as UserModel) || model<User, UserModel>('User', userSchema)

export default UserModel
