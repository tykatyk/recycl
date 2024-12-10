import * as yup from 'yup'
import { email } from './atomicValidators'

export default yup.object().shape({
  email,
})
