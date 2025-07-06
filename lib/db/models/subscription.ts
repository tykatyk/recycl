import { ObjectId } from 'mongodb'
import { Model, Schema, models, model, InferSchemaType } from 'mongoose'

export const wasteRemovalSubscription = 'wasteRemoval'

const subscriptionElements = new Schema(
  {
    isActive: Boolean,
    type: 'String',
    enum: [wasteRemovalSubscription],
  },
  { timestamps: true },
)

const subscriptionSchema = new Schema(
  {
    user: { type: ObjectId, required: true },
    email: { type: String, required: true },
    elements: [subscriptionElements],
  },
  { timestamps: true },
)

export type Subscription = InferSchemaType<typeof subscriptionSchema>

export default (models.Subscription as Model<Subscription>) ||
  model<Subscription>('Subscription', subscriptionSchema)
