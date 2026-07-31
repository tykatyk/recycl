import { Schema, Model, models, model, InferSchemaType } from 'mongoose'
import { contactPhone, locationSchema, expires } from '../dbModelCommons'
import { documentActivityStatus } from '../../../constants'

const adSchema = new Schema(
  {
    //ToDo: refactor user schema. Use one from dbModelCommons
    title: {
      type: String,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    wasteLocation: {
      type: locationSchema,
      required: true,
    },

    wasteType: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    //ToDo: maybe make contactPhone required
    contactPhone,
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
    expires,
  },
  { timestamps: true },
)
export type Ad = InferSchemaType<typeof adSchema>

type AdModel = Model<Ad>

const AdModel = (models.Ad as AdModel) || model<Ad, AdModel>('Ad', adSchema)

export default AdModel
