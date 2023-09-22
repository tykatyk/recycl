import * as yup from 'yup'

import {
  phone,
  wasteLocation,
  wasteType,
  comment,
  startTime,
  endTime,
  date,
} from './atomicValidators'

import validationMessages from './messages'
const { required } = validationMessages

const eventValidationSchema = yup.object({
  location: wasteLocation,
  wasteType,
  phone: phone.required(required),
  comment,
  date,
  startTime,
  // endTime,
})
export interface FormikEventValues
  extends yup.InferType<typeof eventValidationSchema> {
  // using interface instead of type generally gives nicer editor feedback
}

export default eventValidationSchema