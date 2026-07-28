import * as yup from 'yup'
import { validation } from '@recycl/shared'

const { email, validationMessages: messages } = validation
const { required, minLength, maxLength } = messages

export default yup.object().shape({
  name: yup.string().required(required).min(3, minLength).max(255, maxLength),
  email,
})
