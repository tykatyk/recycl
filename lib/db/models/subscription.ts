import { Model, Schema, models, model, InferSchemaType } from 'mongoose'
const subscriptionSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    elements: [
      {
        name: { type: String, required: true },
        subscribed: { type: Boolean, default: true, required: true },
        unsubscribeToken: { type: String, unique: true, required: true },
        unsubscribeTokenUsed: { type: Boolean, default: false, required: true },
        unsubscribeTokenExpires: { type: Date, required: true },
        listUnsubscribeToken: { type: String, unique: true, required: true },
      },
    ],
  },
  { timestamps: true },
)

export type Subscription = InferSchemaType<typeof subscriptionSchema>

export default (models.Subscription as Model<Subscription>) ||
  model<Subscription>('Subscription', subscriptionSchema)
