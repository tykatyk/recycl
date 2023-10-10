import { Schema, models, model, InferSchemaType } from 'mongoose'

import {
  contactPhone,
  expires,
  userSchema,
  locationSchema,
} from '../../helpers/dbModelCommons'

const eventSchema = new Schema(
  {
    user: { type: userSchema, required: true },
    location: { type: locationSchema, required: true },
    waste: {
      type: Schema.Types.ObjectId,
      ref: 'WasteType',
      required: true,
    },
    date: { type: Date, required: true },
    startTime: Date,
    endTime: Date,
    phone: { ...contactPhone, required: true },
    isActive: { type: Boolean, default: true },
    comment: String,
    expires,
  },
  { timestamps: true },
)

type Event = InferSchemaType<typeof eventSchema>

export default models.Event || model<Event>('Event', eventSchema)
