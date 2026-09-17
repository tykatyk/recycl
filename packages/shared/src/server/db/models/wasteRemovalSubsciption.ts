import mongoose, { type InferSchemaType } from 'mongoose'

const { models, model } = mongoose

const wasteRemovalSubscriptionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
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

type WasteRemovalSubscriptionModel = mongoose.Model<WasteRemovalSubscription>

const WasteRemovalSubscriptionModel =
  (models.WasteRemovalSubscription as WasteRemovalSubscriptionModel) ||
  model<WasteRemovalSubscription, WasteRemovalSubscriptionModel>(
    'WasteRemovalSubscription',
    wasteRemovalSubscriptionSchema,
  )

export default WasteRemovalSubscriptionModel
