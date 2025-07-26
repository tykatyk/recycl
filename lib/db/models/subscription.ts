import { Model, Schema, models, model, InferSchemaType } from 'mongoose'

export const wasteRemovalSubscription = 'wasteRemoval'

const subscriptionElements = new Schema(
  {
    isActive: { type: Boolean, required: true },
    name: {
      type: 'String',
      enum: [wasteRemovalSubscription],
      required: true,
    },
  },
  { timestamps: true },
)

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
