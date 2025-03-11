import * as yup from 'yup'
import { email } from './atomicValidators'
import messages from './messages'

const { required, minLength, maxLength } = messages

export default yup.object().shape({
  name: yup.string().required(required).min(3, minLength).max(255, maxLength),
  email,
})
