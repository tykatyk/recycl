import mongoose, { type InferSchemaType } from 'mongoose'
import { locationSchema } from '../dbModelCommons.js'
import { wasteTypeNames } from '../../../constants.js'

const { models, model } = mongoose

const wasteAvailableSubscriptionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
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

type WasteAvailableSubscriptionModel =
  mongoose.Model<WasteAvailableSubscription>

const WasteAvailableSubscriptionModel =
  (models.WasteAvailableSubscription as WasteAvailableSubscriptionModel) ||
  model<WasteAvailableSubscription, WasteAvailableSubscriptionModel>(
    'WasteAvailableSubscription',
    wasteAvailableSubscriptionSchema,
  )

export default WasteAvailableSubscriptionModel
