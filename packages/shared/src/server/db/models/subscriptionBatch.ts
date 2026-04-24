import { Schema, model, models, InferSchemaType, Model } from 'mongoose'

const subscriptionEmailBatchSchema = new Schema(
  {
    runId: {
      type: Schema.Types.ObjectId,
      ref: 'SubscriptionEmailRun',
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['queued', 'processing', 'completed', 'failed', 'cancelled'],
      required: true,
      default: 'queued',
      index: true,
    },
    recipientIds: {
      type: [String],
      required: true,
      default: [],
    },
    recipientCount: {
      type: Number,
      required: true,
      default: 0,
    },
    sentCount: {
      type: Number,
      default: 0,
    },
    failedCount: {
      type: Number,
      default: 0,
    },
    skippedCount: {
      type: Number,
      default: 0,
    },
    startedAt: {
      type: Date,
      default: null,
    },
    finishedAt: {
      type: Date,
      default: null,
    },
    errorMessage: {
      type: String,
      default: null,
    },
  },
  { timestamps: true },
)

// subscriptionEmailBatchSchema.index({ runId: 1 }, { unique: true })

export type SubscriptionEmailBatch = InferSchemaType<
  typeof subscriptionEmailBatchSchema
>

type SubscriptionEmailBatchModel = Model<SubscriptionEmailBatch>

const SubscriptionEmailBatchModel =
  (models.SubscriptionEmailBatch as SubscriptionEmailBatchModel) ||
  model<SubscriptionEmailBatch, SubscriptionEmailBatchModel>(
    'SubscriptionEmailBatch',
    subscriptionEmailBatchSchema,
  )

export default SubscriptionEmailBatchModel
