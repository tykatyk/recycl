import * as yup from 'yup'
import { validation } from '@recycl/shared'

const { phone, waste, location, notOnlySpaces, validationMessages, comment } =
  validation
const { required, type, positive, minLength, maxLength } = validationMessages

export default yup.object().shape({
  title: yup
    .string()
    .concat(notOnlySpaces)
    .required(required)
    .min(10, minLength)
    .max(255, maxLength),
  wasteLocation: location,
  wasteType: waste,
  quantity: yup.number().typeError(type).positive(positive).required(required),
  contactPhone: phone.required(required),
  comment,
})
