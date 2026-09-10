import { Schema, models, model, InferSchemaType, Model } from 'mongoose'
import { locationSchema } from '../dbModelCommons'
import { wasteTypeNames } from '../../../constants'

const wasteAvailableSubscriptionSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  radius: {
    type: Number,
    required: true,
  },
  location: { type: locationSchema, required: true },
  wasteTypes: [
    {
      type: String,
      enum: wasteTypeNames,
      validate: {
        validator: (value: string[]) => value.length > 0,
        message: 'wasteTypes must contain at least one item',
      },
    },
  ],
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
