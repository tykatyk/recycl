import * as yup from 'yup'
import { message } from './atomicValidators.mjs'

export default yup.object().shape({
  message,
})
