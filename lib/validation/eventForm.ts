import * as yup from 'yup'

import {
  phone,
  location,
  wasteType,
  comment,
  date,
  backendWasteType,
} from './atomicValidators'

import validationMessages from './messages'
const { required } = validationMessages

const eventValidationSchema = yup.object({
  location,
  wasteType,
  phone: phone.required(required),
  comment,
  date,
})
const backendEventValidationSchema = yup.object({
  location,
  wasteType: backendWasteType,
  phone: phone.required(required),
  comment,
  date,
})
export interface FormikEventValues
  extends yup.InferType<typeof eventValidationSchema> {
  // using interface instead of type generally gives nicer editor feedback
}

export { eventValidationSchema, backendEventValidationSchema }
