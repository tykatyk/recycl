import { Schema, Model, models, model, InferSchemaType } from 'mongoose'

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
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    userIp: {
      type: String,
      required: true,
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
