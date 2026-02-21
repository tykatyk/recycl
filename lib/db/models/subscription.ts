import { Model, Schema, models, model, InferSchemaType } from 'mongoose'
const subscriptionSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    variant: {
      type: Schema.Types.ObjectId,
      ref: 'SubscriptionVariant',
      required: true,
    },
    subscribed: { type: Boolean, default: true, required: true },
    unsubscribeTokens: [
      {
        value: { type: String, unique: true, required: true },
        used: { type: Boolean, required: true },
        expires: { type: Date, required: true },
      },
    ],
    listUnsubscribeToken: { type: String, unique: true, required: true },
    lastSentAt: { type: Date },
  },
  { timestamps: true },
)

export type Subscription = InferSchemaType<typeof subscriptionSchema>

export default (models.Subscription as Model<Subscription>) ||
  model<Subscription>('Subscription', subscriptionSchema)
