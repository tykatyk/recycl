import { Schema, models, model, InferSchemaType, Model } from 'mongoose'
import { subscriptionVariantNames } from '../../subscription/subscriptionVariantNames'

const subscriptionVariantSchema = new Schema({
  name: {
    type: String,
    required: true,
    enum: Object.values(subscriptionVariantNames),
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
