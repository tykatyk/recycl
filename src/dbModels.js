import mongoose from 'mongoose'

const removalApplicationSchema = new mongoose.Schema({
  wasteLocation: { description: String, place_id: String },
  wasteType: Number,
  quantity: Number,
  passDocumet: Boolean,
  comment: String,
  notificationCities: [{ description: String, place_id: String }],
  notificationCitiesCheckbox: Boolean,
  notificationRadius: String,
  notificationRadiusCheckbox: Boolean,
})

export default mongoose.models.RemovalApplication ||
  mongoose.model('RemovalApplication', removalApplicationSchema)
