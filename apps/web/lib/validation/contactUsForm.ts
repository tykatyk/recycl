import * as yup from 'yup'
import { validation } from '@recycl/shared'

const { email, notOnlySpaces, validationMessages } = validation
const { required, minLength, maxLength } = validationMessages

export default yup.object().shape({
  subject: yup
    .string()
    .concat(notOnlySpaces)
    .required(required)
    .min(3, minLength)
    .max(255, maxLength),
  userName: yup
    .string()
    .concat(notOnlySpaces)
    .required(required)
    .min(3, minLength)
    .max(255, maxLength),
  email,
  message: yup
    .string()
    .concat(notOnlySpaces)
    .required(required)
    .min(3, minLength)
    .max(1000, maxLength),
})
