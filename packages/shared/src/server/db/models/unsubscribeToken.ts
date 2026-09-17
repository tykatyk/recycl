import mongoose, { type InferSchemaType } from 'mongoose'
const { models, model } = mongoose

const unsubscribeTokenSchema = new mongoose.Schema(
  {
    subscription: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subscription',
      required: true,
    },

    value: { type: String, unique: true, required: true },
    used: { type: Boolean, required: true },
    expires: { type: Date, required: true },
  },
  { timestamps: true },
)

export type UnsubscribeToken = InferSchemaType<typeof unsubscribeTokenSchema>

export default (models.UnsubscribeToken as mongoose.Model<UnsubscribeToken>) ||
  model<UnsubscribeToken>('UnsubscribeToken', unsubscribeTokenSchema)
