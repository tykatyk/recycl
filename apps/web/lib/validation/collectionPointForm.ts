import * as yup from 'yup'
import { validation } from '@recycl/shared'

const { phone, location, wasteArray, comment, date, validationMessages } =
  validation
const { required } = validationMessages

export const collectionPointSchema = yup.object({
  location,
  waste: wasteArray,
  phone: phone.required(required),
  comment,
})

//ToDo: this export is never used
export interface FormikEventValues extends yup.InferType<
  typeof collectionPointSchema
> {
  // using interface instead of type generally gives nicer editor feedback
}
