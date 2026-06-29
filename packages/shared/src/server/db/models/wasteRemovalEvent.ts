import { Model, Schema, models, model, InferSchemaType } from 'mongoose'
import { contactPhone, locationSchema } from '../dbModelCommons'
import { documentActivityStatus } from '../../../constants'

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
    status: {
      type: String,
      Enum: Object.keys(documentActivityStatus),
      required: true,
      default: 'active',
    },
    statusChangeReason: {
      type: String,
    },
    comment: String,
  },
  { timestamps: true },
)

export type WasteRemovalEvent = InferSchemaType<typeof wasteRemovalEventSchema>

type WasteRemovalEventModel = Model<WasteRemovalEvent>

const WasteRemovalEventModel =
  (models.WasteRemovalEvent as WasteRemovalEventModel) ||
  model<WasteRemovalEvent, WasteRemovalEventModel>(
    'WasteRemovalEvent',
    wasteRemovalEventSchema,
  )

export default WasteRemovalEventModel
