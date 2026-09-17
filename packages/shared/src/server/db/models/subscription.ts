import mongoose, { type InferSchemaType } from 'mongoose'
import { subscriptionVariantNames } from '../../subscription/index.js'

const { models, model } = mongoose

const subscriptionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
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

subscriptionSchema.index({
  user: 1,
  subscribed: 1,
  variant: 1,
})

export type Subscription = InferSchemaType<typeof subscriptionSchema>

type SubscriptionModel = mongoose.Model<Subscription>

const SubscriptionModel =
  (models.Subscription as SubscriptionModel) ||
  model<Subscription, SubscriptionModel>('Subscription', subscriptionSchema)

export default SubscriptionModel
