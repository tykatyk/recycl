import * as yup from 'yup'
import { validation } from '@recycl/shared'

const { email, message, notOnlySpaces, validationMessages } = validation
const { required, maxLength } = validationMessages

export default yup.object().shape({
  subject: yup.string().max(255, maxLength).required(required),
  username: yup
    .string()
    .required(required)
    .concat(notOnlySpaces)
    .max(255, maxLength),
  email,
  message,
})
