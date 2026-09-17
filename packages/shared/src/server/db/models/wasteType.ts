import mongoose, { type InferSchemaType } from 'mongoose'
import { wasteTypeNames } from '../../../constants.js'

const { models, model } = mongoose

const wasteTypeSchema = new mongoose.Schema(
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

type WasteTypeModel = mongoose.Model<WasteType>

const WasteTypeModel =
  (models.WasteType as mongoose.Model<WasteType>) ||
  model<WasteType, WasteTypeModel>('WasteType', wasteTypeSchema)

export default WasteTypeModel
