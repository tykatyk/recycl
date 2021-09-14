import mongoose from 'mongoose'
const Schema = mongoose.Schema

//WasteType
const wasteTypeSchema = new Schema({
  name: String,
})
export const WasteType =
  mongoose.models.WasteType || mongoose.model('WasteType', wasteTypeSchema)

//RemovalApplication
const removalApplicationSchema = new Schema({
  wasteLocation: { description: String, place_id: String },
  wasteType: {
    type: Schema.Types.ObjectId,
    ref: 'WasteType',
  },
  quantity: Number,
  passDocumet: Boolean,
  comment: String,
  notificationCities: [{ description: String, place_id: String }],
  notificationCitiesCheckbox: Boolean,
  notificationRadius: String,
  notificationRadiusCheckbox: Boolean,
})

export const RemovalApplication =
  mongoose.models.RemovalApplication ||
  mongoose.model('RemovalApplication', removalApplicationSchema)
