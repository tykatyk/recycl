import * as yup from 'yup'
import { message } from './atomicValidators.js'

export default yup.object().shape({
  message,
})
