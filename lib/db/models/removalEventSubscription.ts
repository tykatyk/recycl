import { Schema, models, model, InferSchemaType } from 'mongoose'

const removalEventSubscriptionSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
    },
    subscriptions: [
      {
        wasteType: 'String',
        city: 'String',
      },
    ],
  },
  { timestamps: true },
)

export type RemovalEventSubscription = InferSchemaType<
  typeof removalEventSubscriptionSchema
>

export default models.RemovalEventNotification ||
  model<RemovalEventSubscription>(
    'RemovalEventSubscription',
    removalEventSubscriptionSchema,
  )
