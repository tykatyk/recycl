import * as yup from 'yup'
import { validation } from '@recycl/shared'

const { phone, location, wasteArray, comment, date, validationMessages } =
  validation
const { required } = validationMessages

export const collectionPointSchema = yup.object({
  location,
  wasteTypes: wasteArray,
  phone: phone.required(required),
  comment,
})
