import { Schema, Types } from 'mongoose'
import {
  phone as phoneValidator,
  email as emailValidator,
} from '../../validation/atomicValidators'

import { AD_EXPIRATION_PERIOD } from '../../constants'

//ToDo: використати цю схему також в ad
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

type GeoPoint = {
  type: 'Point'
  coordinates: [number, number] // [lng, lat]
}

const pointSchema = new Schema<GeoPoint>(
  {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
      validate: {
        validator: (v: number[]) => v.length === 2,
        message: 'Coordinates must be [longitude, latitude]',
      },
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
    return date.setDate(
      date.getDate() + AD_EXPIRATION_PERIOD * 24 * 60 * 60 * 1000,
    )
  },
}

//validates email in db schemas
export const checkEmail = (v: string) => {
  try {
    return !!emailValidator.validateSync(v)
  } catch (error) {
    return false
  }
}
