import mongoose from 'mongoose'
const Schema = mongoose.Schema

const messageSchema = Schema(
  {
    text: {
      type: String,
      required: true,
    },
    ad: {
      type: Schema.Types.ObjectId,
      ref: 'RemovalApplication',
      required: true,
    },
    senderId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      //this filed is purposely not required
      //since user can delete his own messages
      //and won't be sender of this message
    },
    senderName: {
      type: String,
      required: true,
    },
    receiverId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    receiverName: {
      type: String,
      required: true,
    },
    dialogId: {
      type: String,
      required: true,
    },
    dialogInitiatorId: { type: Schema.Types.ObjectId, ref: 'User' },
    dialogReceiverId: { type: Schema.Types.ObjectId, ref: 'User' },
    viewed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
)

export default mongoose.models.Message ||
  mongoose.model('Message', messageSchema)
