import mongoose from 'mongoose'
console.log(mongoose)
async function main() {
  await mongoose.connect(`${process.env.NEXT_PUBLIC_DB}`)
}
main()
const removalRequestSchema = new mongoose.Schema({
  wasteLocation: { description: String, place_id: String },
  wasteType: Number,
  quantity: Number,
  passDocumet: Boolean,
  description: String,
  notificationCities: [{ description: String, place_id: String }],
  notificationCitiesCheckbox: Boolean,
  notificationRadius: String,
  notificationRadiusCheckbox: Boolean,
})

console.log(
  mongoose.models.RemovalApplication ||
    mongoose.model('RemovalApplication', removalRequestSchema)
)

export const RemovalApplicationModel =
  mongoose.models.RemovalApplication ||
  mongoose.model('RemovalApplication', removalRequestSchema)
