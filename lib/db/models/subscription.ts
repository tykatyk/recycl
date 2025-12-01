import { Model, Schema, models, model, InferSchemaType } from 'mongoose'

export const wasteRemovalSubscription = 'wasteRemoval'

const subscriptionElements = new Schema({
  name: {
    type: Schema.Types.ObjectId,
    ref: 'SubscriptionVariant',
    required: true,
  },
  description: {
    type: Schema.Types.ObjectId,
    ref: 'SubscriptionVariant',
    required: true,
  },
  isActive: { type: Boolean, required: true },
})

const subscriptionSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    elements: [subscriptionElements],
  },
  { timestamps: true },
)

export type Subscription = InferSchemaType<typeof subscriptionSchema>

export default (models.Subscription as Model<Subscription>) ||
  model<Subscription>('Subscription', subscriptionSchema)
