import mongoose from 'mongoose'
const Schema = mongoose.Schema

const messageSchema = Schema(
  {
    message: String,
    aplId: { type: Schema.Types.ObjectId, ref: 'RemovalApplication' },
  },
  { timestamps: true }
)
export default mongoose.models.Message ||
  mongoose.model('Message', messageSchema)
