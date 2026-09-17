import mongoose, { type InferSchemaType } from 'mongoose'
import { checkEmail } from '../dbModelCommons.js'

const { model, models } = mongoose

const emailLetterVariants = [
  'proposeWasteType',
  'contact',
  'complaint',
  'other',
] as const
export type EmailLetterVariant = (typeof emailLetterVariants)[number]

const emailLetterSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
    },
    messageType: {
      type: String,
      enum: emailLetterVariants,
      required: true,
      default: 'other',
    },
    to: {
      type: String,
      required: true,
      validate: {
        validator: checkEmail,
        message: (props: mongoose.ValidatorProps) =>
          `${props.value} invalidEmailAddress`,
      },
      lowercase: true,
      trim: true,
      index: true,
    },
    from: {
      type: String,
      required: true,
      validate: {
        validator: checkEmail,
        message: (props: mongoose.ValidatorProps) =>
          `${props.value} invalidEmailAddress`,
      },
      lowercase: true,
      trim: true,
      index: true,
    },
    subject: {
      type: String,
      required: true,
      default: '',
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
      enum: ['queued', 'sent', 'skipped', 'failed'],
      required: true,
      default: 'queued',
    },
    lastError: {
      type: String,
      default: null,
    },
  },
  { timestamps: true },
)

export type EmailLetter = InferSchemaType<typeof emailLetterSchema>

type EmailLetterModel = mongoose.Model<EmailLetter>

const EmailLetterModel =
  (models.EmailLetter as EmailLetterModel) ||
  model<EmailLetter, EmailLetterModel>('EmailLetter', emailLetterSchema)

export default EmailLetterModel
