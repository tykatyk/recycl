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
    listUnsubscribeToken: { type: String, unique: true, required: true },
    lastSentAt: { type: Date },
  },
  { timestamps: true },
)

export type Subscription = InferSchemaType<typeof subscriptionSchema>

type SubscriptionModel = Model<Subscription>

const SubscriptionModel =
  (models.Subscription as SubscriptionModel) ||
  model<Subscription, SubscriptionModel>('Subscription', subscriptionSchema)

export default SubscriptionModel
