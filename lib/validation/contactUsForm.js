import * as yup from 'yup'
import messages from './messages'
import { email, notOnlySpaces } from './atomicValidators'

const { required, maxLength } = messages

export default yup.object().shape({
  subject: yup.string().max(255, maxLength).required(required),
  username: yup
    .string()
    .required(required)
    .concat(notOnlySpaces)
    .max(255, maxLength),
  email,
  message: yup
    .string()
    .max(1000, maxLength)
    .concat(notOnlySpaces)
    .required(required),
})
