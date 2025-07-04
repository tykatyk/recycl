import { Model, Schema, models, model, InferSchemaType } from 'mongoose'
import { contactPhone, locationSchema } from '../../helpers/dbModelCommons'

const subscriptionElements = new Schema(
  {
    city: { type: locationSchema, required: true },
    wasteTypes: ['String'],
    isActive: Boolean,
  },
  { timestamps: true },
)

const removalEventSubscriptionSchema = new Schema(
  {
    email: { type: String, required: true },
    elements: [subscriptionElements],
  },
  { timestamps: true },
)

export type RemovalEventSubscription = InferSchemaType<
  typeof removalEventSubscriptionSchema
>

export default (models.RemovalEventSubscription as Model<RemovalEventSubscription>) ||
  model<RemovalEventSubscription>(
    'RemovalEventSubscription',
    removalEventSubscriptionSchema,
  )
