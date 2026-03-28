import { Schema, model, models, InferSchemaType, Model } from 'mongoose'

const emailDeliverySchema = new Schema(
  {
    runId: {
      type: Schema.Types.ObjectId,
      ref: 'SubscriptionEmailRun',
      required: true,
      index: true,
    },
    userId: {
      type: String,
      required: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
    },
    idempotencyKey: {
      type: String,
      required: true,
      unique: true,
    },
    provider: {
      type: String,
      required: true,
      default: 'sendpulse',
    },
    providerMessageId: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ['queued', 'sent', 'failed'],
      required: true,
      default: 'queued',
      index: true,
    },
    lastError: {
      type: String,
      default: null,
    },
  },
  { timestamps: true },
)

export type EmailDelivery = InferSchemaType<typeof emailDeliverySchema>

type EmailDeliveryModel = Model<EmailDelivery>

const EmailDeliveryModel =
  (models.EmailDelivery as EmailDeliveryModel) ||
  model<EmailDelivery, EmailDeliveryModel>('EmailDelivery', emailDeliverySchema)

export default EmailDeliveryModel
