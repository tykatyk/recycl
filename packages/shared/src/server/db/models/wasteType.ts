import { Schema, Model, models, model, InferSchemaType } from 'mongoose'
import { wasteTypeNames } from '../../../constants'

const wasteTypeSchema = new Schema(
  {
    name: {
      type: String,
      enum: wasteTypeNames,
      required: true,
      index: true,
      unique: true,
    },
  },
  { timestamps: true },
)

export type WasteType = InferSchemaType<typeof wasteTypeSchema>

type WasteTypeModel = Model<WasteType>

const WasteTypeModel =
  (models.WasteType as Model<WasteType>) ||
  model<WasteType, WasteTypeModel>('WasteType', wasteTypeSchema)

export default WasteTypeModel
