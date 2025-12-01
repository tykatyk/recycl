import { Schema, models, model, InferSchemaType } from 'mongoose'

const subscriptionVariantSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
})

export type SubscriptionVariant = InferSchemaType<
  typeof subscriptionVariantSchema
>

export default models.SubscriptionVariant ||
  model<SubscriptionVariant>('SubscriptionVariant', subscriptionVariantSchema)
