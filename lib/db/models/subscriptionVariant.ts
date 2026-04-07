import { Schema, models, model, InferSchemaType, Model } from 'mongoose'
import { subscriptionVariantNames } from '../../helpers/subscriptions'

const subscriptionVariantSchema = new Schema({
  name: {
    type: String,
    required: true,
    enum: Object.values(subscriptionVariantNames),
  },
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
