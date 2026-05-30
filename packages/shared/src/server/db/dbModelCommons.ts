import { Schema, Types } from 'mongoose'
import { phone as phoneValidator } from '../../validation/atomicValidators'

const NUM_DAYS_TO_EXPIRE = 30

export const documentActivityStatus = {
  active: 'active',
  blocked: 'blocked',
  disabled: 'disabled',
} as const

//ToDo: використати цю схему також в removalApplication
export const userSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
})

export const contactPhone = {
  type: String,
  validate: {
    validator: (v: string) => {
      try {
        return !!phoneValidator.validateSync(v)
      } catch (error) {
        return false
      }
    },
    message: (props: { value: string }) =>
      `${props.value} Недействительный номер телефона!`,
  },
}

const pointSchema = new Schema(
  {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  { _id: false },
)

const structuredFormattingSchema = new Schema(
  {
    main_text: {
      type: String,
      required: true,
    },
    secondary_text: {
      type: String,
      required: true,
    },
  },
  { _id: false },
)

export const locationSchema = new Schema(
  {
    description: {
      type: String,
      required: true,
    },
    place_id: {
      type: String,
      required: true,
    },
    structured_formatting: { type: structuredFormattingSchema, required: true },
    position: {
      type: pointSchema,
      index: '2dsphere',
      required: true,
    },
  },
  { _id: false },
)

export const expires = {
  type: Date,
  required: true,
  default: () => {
    const date = new Date()
    return date.setDate(date.getDate() + NUM_DAYS_TO_EXPIRE)
  },
}
