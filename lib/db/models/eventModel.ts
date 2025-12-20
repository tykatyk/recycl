import { Model, Schema, models, model, InferSchemaType } from 'mongoose'
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
      type: String,
      required: true,
    },
    street: { type: String /*required: true*/ },
    date: { type: Date, required: true },
    phone: { ...contactPhone, required: true },

    viewCount: {
      type: Number,
      default: 0,
    },
    viewedBy: {
      type: Array,
    },
    isActive: { type: Boolean, default: true },
    comment: String,
  },
  { timestamps: true },
)

export type EventType = InferSchemaType<typeof eventSchema>

export default (models.Event as Model<EventType>) ||
  model<EventType>('Event', eventSchema)
