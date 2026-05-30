import { Schema, Model, models, model, InferSchemaType } from 'mongoose'

const wasteTypeSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    genitive: {
      type: String,
      required: true,
    },
    //ToDo: Add name and genitive in russian
  },
  { timestamps: true },
)

export type WasteType = InferSchemaType<typeof wasteTypeSchema>

type WasteTypeModel = Model<WasteType>

const WasteTypeModel =
  (models.WasteType as Model<WasteType>) ||
  model<WasteType, WasteTypeModel>('WasteType', wasteTypeSchema)

export default WasteTypeModel
