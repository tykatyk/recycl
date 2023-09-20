import * as yup from 'yup'
import { email, password } from './atomicValidators'

export default yup.object().shape({
  password,
  email,
})
