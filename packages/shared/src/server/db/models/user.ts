import { Schema, models, model, InferSchemaType, Model } from 'mongoose'
import type { ValidatorProps } from 'mongoose'
import cryptoRandomString from 'crypto-random-string'
import { phone as phoneValidator } from '../../../validation/atomicValidators'
import { checkEmail } from '../dbModelCommons'
import { documentActivityStatus } from '../../../constants'
import { validationMessages } from '../../../validation'

const { email: invalidEmailAddress, phone: invalidPhoneNumber } =
  validationMessages

const { active, blocked } = documentActivityStatus

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
  { timestamps: true },
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
export type User = InferSchemaType<typeof userSchema>

type UserModel = Model<User>
const UserModel =
  (models.User as Model<User>) || model<User, UserModel>('User', userSchema)

export default UserModel
