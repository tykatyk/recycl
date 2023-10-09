import * as yup from 'yup'

import { phone, location, waste, comment, date } from './atomicValidators'

import validationMessages from './messages'
const { required } = validationMessages

const eventValidationSchema = yup.object({
  location,
  waste,
  phone: phone.required(required),
  comment,
  date,
})

//ToDo: this export is never used
export interface FormikEventValues
  extends yup.InferType<typeof eventValidationSchema> {
  // using interface instead of type generally gives nicer editor feedback
}

export { eventValidationSchema }
