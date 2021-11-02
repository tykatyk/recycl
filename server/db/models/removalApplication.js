import mongoose from 'mongoose'
const Schema = mongoose.Schema

const removalApplicationSchema = Schema(
  {
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
    },
    wasteType: {
      type: Schema.Types.ObjectId,
      ref: 'WasteType',
    },
    quantity: Number,
    passDocumet: Boolean,
    comment: String,
    notificationCities: [{ description: String, place_id: String }],
    notificationCitiesCheckbox: Boolean,
    notificationRadius: String,
    notificationRadiusCheckbox: Boolean,
  },
  { timestamps: true }
)

export default mongoose.models.RemovalApplication ||
  mongoose.model('RemovalApplication', removalApplicationSchema)
