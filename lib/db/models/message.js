import mongoose from 'mongoose'
const Schema = mongoose.Schema

const messageSchema = Schema(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    receiver: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    text: String,
    ad: {
      type: Schema.Types.ObjectId,
      ref: 'RemovalApplication',
      required: true,
    },
    isViewed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
)
export default mongoose.models.Message ||
  mongoose.model('Message', messageSchema)
