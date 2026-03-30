import { Schema, model, models, InferSchemaType, Model, Types } from 'mongoose'
import { subscriptionVariantNames } from '../../helpers/subscriptions'

const subscriptionJobRunSchema = new Schema(
  {
    subscriptionVariantName: {
      type: String,
      enum: Object.values(subscriptionVariantNames),
      required: true,
    },
    status: {
      type: String,
      enum: [
        'queued',
        'processing',
        'completed',
        'failed',
        'cancelRequested',
        'cancelled',
      ],
      required: true,
      default: 'queued',
      index: true,
    },
    requestedBy: {
      type: String,
      default: null,
    },
    requestedAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
    startedAt: {
      type: Date,
      default: null,
    },
    finishedAt: {
      type: Date,
      default: null,
    },
    lastHeartbeatAt: {
      type: Date,
      default: null,
    },
    totalRecipients: {
      type: Number,
      default: 0,
    },
    processedCount: {
      type: Number,
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
    errorMessage: {
      type: String,
      default: null,
    },
  },
  { timestamps: true },
)

export type SubscriptionRun = InferSchemaType<typeof subscriptionJobRunSchema>

type SubscriptionRunModel = Model<SubscriptionRun>

const SubscriptionRunModel =
  (models.SubscriptionRun as SubscriptionRunModel) ||
  model<SubscriptionRun, SubscriptionRunModel>(
    'SubscriptionRun',
    subscriptionJobRunSchema,
  )

export default SubscriptionRunModel
