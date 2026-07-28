import { Model, Schema, models, model, InferSchemaType } from 'mongoose'
const unsubscribeTokenSchema = new Schema(
  {
    subscription: {
      type: Schema.Types.ObjectId,
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

export default (models.UnsubscribeToken as Model<UnsubscribeToken>) ||
  model<UnsubscribeToken>('UnsubscribeToken', unsubscribeTokenSchema)
