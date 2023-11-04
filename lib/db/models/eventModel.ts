import { Schema, models, model, InferSchemaType } from 'mongoose'
import { contactPhone, locationSchema } from '../../helpers/dbModelCommons'

const eventSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    location: { type: locationSchema, required: true },
    waste: {
      type: Schema.Types.ObjectId,
      ref: 'WasteType',
      required: true,
    },
    date: { type: Date, required: true },
    viewCount: {
      type: Number,
      default: 0,
    },
    viewedBy: {
      type: Array,
    },
    phone: { ...contactPhone, required: true },
    isActive: { type: Boolean, default: true },
    comment: String,
  },
  { timestamps: true },
)

type Event = InferSchemaType<typeof eventSchema>

export default models.Event || model<Event>('Event', eventSchema)
