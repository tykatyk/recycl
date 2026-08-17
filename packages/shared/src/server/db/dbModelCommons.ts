import { Schema, Types, ValidatorProps } from 'mongoose'
import {
  phone as phoneValidator,
  email as emailValidator,
} from '../../validation/atomicValidators'

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
    message: (props: ValidatorProps) => `${props.value} invalidPhoneNumber`,
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

//validates email in db schemas
export const checkEmail = (v: string) => {
  try {
    return !!emailValidator.validateSync(v)
  } catch (error) {
    return false
  }
}
