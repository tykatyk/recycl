import { Schema, models, model, InferSchemaType, Model } from 'mongoose'
import { locationSchema } from '../../helpers/dbModelCommons'

const wasteAvailableSubscriptionSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  subscription: {
    type: Schema.Types.ObjectId,
    ref: 'Subscription',
    required: true,
  },
  location: { type: locationSchema, required: true },
  wasteTypes: [String],
})

export type WasteAvailableSubscription = InferSchemaType<
  typeof wasteAvailableSubscriptionSchema
>

type WasteAvailableSubscriptionModel = Model<WasteAvailableSubscription>

const WasteAvailableSubscriptionModel =
  (models.WasteAvailableSubscription as WasteAvailableSubscriptionModel) ||
  model<WasteAvailableSubscription, WasteAvailableSubscriptionModel>(
    'WasteAvailableSubscription',
    wasteAvailableSubscriptionSchema,
  )

export default WasteAvailableSubscriptionModel
