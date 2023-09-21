import { Schema, models, model, InferSchemaType } from 'mongoose'

import {
  contactPhone,
  expires,
  wasteSchema,
  userSchema,
  locationSchema,
} from '../../helpers/dbModelCommons'

const eventSchema = new Schema(
  {
    user: { type: userSchema, required: true },
    location: { type: locationSchema, required: true },
    wasteType: { type: wasteSchema, required: true },
    date: { type: Date, required: true },
    startTime: Date,
    endTime: Date,
    phone: { ...contactPhone, required: true },
    isActive: { type: Boolean, default: true },
    comment: String,
    expires,
  },
  { timestamps: true }
)

type Event = InferSchemaType<typeof eventSchema>

export default models.Event || model<Event>('Event', eventSchema)
