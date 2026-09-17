import mongoose, { type InferSchemaType } from 'mongoose'
import { subscriptionVariantNames } from '../../subscription/index.js'

const { models, model } = mongoose

const subscriptionVariantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    enum: Object.values(subscriptionVariantNames),
    index: true,
  },
})

export type SubscriptionVariant = InferSchemaType<
  typeof subscriptionVariantSchema
>

type SubscriptionVariantModel = mongoose.Model<SubscriptionVariant>

const SubscriptionVariantModel =
  (models.SubscriptionVariant as SubscriptionVariantModel) ||
  model<SubscriptionVariant, SubscriptionVariantModel>(
    'SubscriptionVariant',
    subscriptionVariantSchema,
  )

export default SubscriptionVariantModel
