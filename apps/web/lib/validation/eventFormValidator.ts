import * as yup from 'yup'
import { validation } from '@recycl/shared'

const { phone, location, waste, comment, date, validationMessages } = validation
const { required } = validationMessages

const eventValidationSchema = yup.object({
  location,
  waste,
  phone: phone.required(required),
  comment,
  date,
})

//ToDo: this export is never used
export interface FormikEventValues extends yup.InferType<
  typeof eventValidationSchema
> {
  // using interface instead of type generally gives nicer editor feedback
}

export { eventValidationSchema }
