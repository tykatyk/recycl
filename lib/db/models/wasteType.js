import mongoose from 'mongoose'
const Schema = mongoose.Schema

const wasteTypeSchema = Schema(
  {
    name: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
)
export default mongoose.models.WasteType ||
  mongoose.model('WasteType', wasteTypeSchema)
