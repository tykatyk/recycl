import { Schema, models, model, InferSchemaType, Model } from 'mongoose'

const wasteRemovalSubscriptionSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  radius: {
    type: Number,
    required: true,
  },
})

export type WasteRemovalSubscription = InferSchemaType<
  typeof wasteRemovalSubscriptionSchema
>

type WasteRemovalSubscriptionModel = Model<WasteRemovalSubscription>

const WasteRemovalSubscriptionModel =
  (models.WasteRemovalSubscription as WasteRemovalSubscriptionModel) ||
  model<WasteRemovalSubscription, WasteRemovalSubscriptionModel>(
    'WasteRemovalSubscription',
    wasteRemovalSubscriptionSchema,
  )

export default WasteRemovalSubscriptionModel
