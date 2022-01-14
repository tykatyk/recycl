import mongoose from 'mongoose'
const Schema = mongoose.Schema
const NUM_DAYS_TO_EXPIRE = 30

const pointSchema = Schema({
  type: {
    type: String,
    enum: ['Point'],
    required: true,
  },
  coordinates: {
    type: [Number],
    required: true,
  },
})

const removalApplicationSchema = Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    wasteLocation: {
      description: String,
      place_id: String,
      structured_formatting: {
        main_text: String,
        main_text_matched_substrings: [
          {
            length: Number,
            offset: Number,
          },
        ],
        secondary_text: String,
      },
      position: {
        type: pointSchema,
        required: true,
      },
    },
    wasteType: {
      type: Schema.Types.ObjectId,
      ref: 'WasteType',
      required: true,
    },
    quantity: Number,
    passDocumet: Boolean,
    comment: String,
    notificationCities: [{ description: String, place_id: String }],
    notificationCitiesCheckbox: Boolean,
    notificationRadius: String,
    notificationRadiusCheckbox: Boolean,
    expires: {
      type: Date,
      required: true,
      default: () => {
        const date = new Date()
        return date.setDate(date.getDate() + NUM_DAYS_TO_EXPIRE)
      },
    },
  },
  { timestamps: true }
)

export default mongoose.models.RemovalApplication ||
  mongoose.model('RemovalApplication', removalApplicationSchema)
