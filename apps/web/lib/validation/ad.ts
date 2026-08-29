import * as yup from 'yup'
import {
  phone,
  waste,
  location,
  notOnlySpaces,
  validationMessages,
  comment,
} from '@recycl/shared/dist/validation'

const { required, onlyDigits, positive, minLength, maxLength } =
  validationMessages

export default yup.object({
  title: yup
    .string()
    .concat(notOnlySpaces)
    .required(required)
    .min(10, minLength)
    .max(255, maxLength),
  wasteLocation: location,
  wasteType: waste,
  quantity: yup
    .number()
    .typeError(onlyDigits)
    .positive(positive)
    .required(required),
  contactPhone: phone.required(required),
  comment,
})
