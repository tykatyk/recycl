import { Schema, Model, models, model, InferSchemaType } from 'mongoose'
import {
  contactPhone,
  locationSchema,
  expires,
} from '../../helpers/dbModelCommons'

const removalApplicationSchema = new Schema(
  {
    //ToDo: refactor user schema. Use one from dbModelCommons
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    //ToDo: refactor wasteLocation schema. Use locationSchema from dbModelCommons
    wasteLocation: {
      type: locationSchema,
      required: true,
    },

    wasteType: {
      type: String,
      required: true,
    },
    quantity: Number,
    //ToDo: maybe make contactPhone required
    contactPhone,
    passDocumet: Boolean,
    isActive: Boolean,
    comment: String,
    notificationCities: [{ description: String, place_id: String }],
    notificationCitiesCheckbox: Boolean,
    notificationRadius: String,
    notificationRadiusCheckbox: Boolean,
    expires,
  },
  { timestamps: true },
)
export type RemovalApplication = InferSchemaType<
  typeof removalApplicationSchema
>

type RemovalApplicationModel = Model<RemovalApplication>

const RemovalApplicationModel =
  (models.RemovalApplication as RemovalApplicationModel) ||
  model<RemovalApplication, RemovalApplicationModel>(
    'RemovalApplication',
    removalApplicationSchema,
  )

export default RemovalApplicationModel
