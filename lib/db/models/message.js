import mongoose from 'mongoose'
const Schema = mongoose.Schema

const messageSchema = Schema(
  {
    message: String,
    isViewed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
)
export default mongoose.models.Message ||
  mongoose.model('Message', messageSchema)
