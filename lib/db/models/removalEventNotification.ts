import { Schema, models, model, InferSchemaType } from 'mongoose'

const removalEventNotificationSchema = new Schema({
  lastProcessedEvent: {
    type: Schema.Types.ObjectId,
    ref: 'Event',
    required: true,
  },
  operationDateTime: { type: Date, required: true },
})

export type RemovalEventNotification = InferSchemaType<
  typeof removalEventNotificationSchema
>

export default models.RemovalEventNotification ||
  model<RemovalEventNotification>(
    'RemovalEventNotification',
    removalEventNotificationSchema,
  )
