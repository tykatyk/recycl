import { Model, Schema, models, model, InferSchemaType } from 'mongoose'
import { contactPhone, locationSchema } from '../../helpers/dbModelCommons'

const wasteRemovalEventSchema = new Schema(
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
    isActive: { type: Boolean, default: true, required: true },
    comment: String,
  },
  { timestamps: true },
)

export type WasteRemovalEvent = InferSchemaType<typeof wasteRemovalEventSchema>

type WasteRemovalEventModel = Model<WasteRemovalEvent>

const WasteRemovalEventModel =
  (models.WasteRemovalEvent as WasteRemovalEventModel) ||
  model<WasteRemovalEvent, WasteRemovalEventModel>(
    'Event',
    wasteRemovalEventSchema,
  )

export default WasteRemovalEventModel
