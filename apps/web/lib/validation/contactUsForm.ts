import * as yup from 'yup'
import {
  email,
  notOnlySpaces,
  validationMessages,
  userName,
  comment,
} from '@recycl/shared/dist/validation'

const { required, minLength, maxLength } = validationMessages

export default yup.object({
  subject: yup
    .string()
    .concat(notOnlySpaces)
    .required(required)
    .min(3, minLength)
    .max(255, maxLength),
  userName,
  email,
  message: comment.required(required),
})
