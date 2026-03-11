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

const SubscriptionVariantModel =
  (models.SubscriptionVariant as SubscriptionVariantModel) ||
  model<SubscriptionVariant, SubscriptionVariantModel>(
    'SubscriptionVariant',
    subscriptionVariantSchema,
  )

export default SubscriptionVariantModel
