import { Schema, Model, models, model, InferSchemaType } from 'mongoose'
import { checkEmail } from '../dbModelCommons'
import { complaintContentVariants } from '../../../constants'
import type { ValidatorProps } from 'mongoose'

const complaintSchema = new Schema(
  {
    //ToDo: refactor user schema. Use one from dbModelCommons
    complaint: {
      type: String,
      required: true,
    },
    complaintUrl: {
      type: String,
      required: true,
    },
    contentType: {
      type: String,
      Enum: complaintContentVariants,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    userIp: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
    },
    userEmail: {
      type: String,
      validate: {
        validator: checkEmail,
        message: (props: ValidatorProps) =>
          `${props.value} invalidEmailAddress`,
      },
      lowercase: true,
      trim: true,
    },
  },
  { timestamps: true },
)
export type Complaint = InferSchemaType<typeof complaintSchema>

type ComplaintModel = Model<Complaint>

const ComplaintModel =
  (models.Complaint as ComplaintModel) ||
  model<Complaint, ComplaintModel>('Complaint', complaintSchema)

export default ComplaintModel
