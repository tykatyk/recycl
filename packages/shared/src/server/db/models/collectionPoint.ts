import { Model, Schema, models, model, InferSchemaType } from 'mongoose'
import { contactPhone, locationSchema } from '../dbModelCommons'
import { documentActivityStatus } from '../../../constants'

const options = { discriminatorKey: 'variant' }

const collectionPointSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    location: { type: locationSchema, required: true },
    wasteTypes: {
      type: [String],
      required: true,
    },
    phone: { ...contactPhone, required: true },

    viewCount: {
      type: Number,
      default: 0,
    },
    viewedBy: {
      type: Array,
    },
    status: {
      type: String,
      Enum: Object.keys(documentActivityStatus),
      required: true,
      default: documentActivityStatus.active,
    },
    statusChangeReason: {
      type: String,
    },
    comment: String,
  },
  { timestamps: true, ...options },
)

export type CollectionPoint = InferSchemaType<typeof collectionPointSchema>

type CollectionPointModel = Model<CollectionPoint>

const CollectionPointModel =
  (models.CollectionPoint as CollectionPointModel) ||
  model<CollectionPoint, CollectionPointModel>(
    'CollectionPoint',
    collectionPointSchema,
  )

const collectionPointContainerSchema = new Schema({}, options)

const collectionPointStationerySchema = new Schema(
  {
    receiveParcels: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  options,
)

const collectionPointMobileSchema = new Schema(
  {
    date: {
      type: Date,
      required: true,
    },
  },
  options,
)

type CollectionPointContainerFields = InferSchemaType<
  typeof collectionPointContainerSchema
>

type CollectionPointStationeryFields = InferSchemaType<
  typeof collectionPointStationerySchema
>

type CollectionPointMobileFields = InferSchemaType<
  typeof collectionPointMobileSchema
>

export type CollectionPointContainer = CollectionPoint &
  CollectionPointContainerFields

export type CollectionPointStationery = CollectionPoint &
  CollectionPointStationeryFields

export type CollectionPointMobile = CollectionPoint &
  CollectionPointMobileFields

type CollectionPointContainerModel = Model<CollectionPointContainer>
type CollectionPointStationeryModel = Model<CollectionPointStationery>
type CollectionPointMobileModel = Model<CollectionPointMobile>

export const CollectionPointContainerModel =
  (CollectionPointModel.discriminators?.container as
    | CollectionPointContainerModel
    | undefined) ||
  CollectionPointModel.discriminator<
    CollectionPointContainer,
    CollectionPointContainerModel
  >('container', collectionPointContainerSchema)

export const CollectionPointStationeryModel =
  (CollectionPointModel.discriminators?.stationery as
    | CollectionPointStationeryModel
    | undefined) ||
  CollectionPointModel.discriminator<
    CollectionPointStationery,
    CollectionPointStationeryModel
  >('stationery', collectionPointStationerySchema)

export const CollectionPointMobileModel =
  (CollectionPointModel.discriminators?.mobile as
    | CollectionPointMobileModel
    | undefined) ||
  CollectionPointModel.discriminator<
    CollectionPointMobile,
    CollectionPointMobileModel
  >('mobile', collectionPointMobileSchema)

export default CollectionPointModel
