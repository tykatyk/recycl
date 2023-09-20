import * as yup from 'yup'
import { message } from './atomicValidators'

export default yup.object().shape({
  message,
})
