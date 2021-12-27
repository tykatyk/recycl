import mongoose from 'mongoose'
const Schema = mongoose.Schema

const accountSchema = Schema(
  {
    type: {
      type: String,
      maxLength: 255,
      required: true,
    },
    provider: {
      type: String,
      maxLength: 255,
      required: true,
    },
    providerAccountId: {
      type: String,
      maxLength: 255,
      required: true,
    },
    refreshToken: {
      type: String,
      maxLength: 255,
    },
    accessToken: {
      type: String,
      maxLength: 255,
      required: false,
    },
    expiresAt: {
      type: Number,
      required: false,
    },
    tokenType: {
      type: String,
      maxLength: 255,
      required: false,
    },
    scope: {
      type: String,
      maxLength: 255,
    },
    idToken: {
      type: String,
      maxLength: 255,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    oAuthTokenSecret: {
      type: String,
      maxLength: 255,
    },
    oAuthToken: {
      type: String,
      maxLength: 255,
    },
    sessionState: {
      type: String,
      maxLength: 255,
    },
  },
  { timestamps: true }
)
export default mongoose.models.Account ||
  mongoose.model('Account', accountSchema)
