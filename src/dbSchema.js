import mongoose from 'mongoose'

async function main() {
  await mongoose.connect(`${process.env.NEXT_PUBLIC_DB}`)
}

main().catch((err) => console.log('Error while connecting to the database'))

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

export const RemovalApplicationModel = mongoose.model(
  'RemovalApplication',
  removalApplicationSchema
)
