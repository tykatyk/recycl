import { Model, Schema, models, model, InferSchemaType } from 'mongoose'
import { subscriptionVariantNames } from '../../subscription'

const subscriptionSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    variant: {
      enum: Object.values(subscriptionVariantNames),
      type: String,
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
