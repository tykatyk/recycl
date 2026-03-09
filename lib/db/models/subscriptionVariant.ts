import { Schema, models, model, InferSchemaType, Model } from 'mongoose'

const subscriptionVariantSchema = new Schema({
  name: String,
  userDescription: {
    type: String,
    required: true,
  },
  isConfigurable: {
    type: Boolean,
    default: false,
  },
})

export type SubscriptionVariant = InferSchemaType<
  typeof subscriptionVariantSchema
>

type SubscriptionVariantModel = Model<SubscriptionVariant>

// export default (models.SubscriptionVariant as Model<SubscriptionVariant>) ||
//   model<SubscriptionVariant>('SubscriptionVariant', subscriptionVariantSchema)

export const SubscriptionVariant =
  (models.SubscriptionVariant as SubscriptionVariantModel) ||
  model<SubscriptionVariant, SubscriptionVariantModel>(
    'SubscriptionVariant',
    subscriptionVariantSchema,
  )
