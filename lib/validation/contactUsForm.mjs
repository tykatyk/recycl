import * as yup from 'yup'
import messages from './messages.mjs'
import { email, message, notOnlySpaces } from './atomicValidators.mjs'

const { required, maxLength } = messages

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
