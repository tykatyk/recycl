import * as yup from 'yup'
import { validation } from '@recycl/shared'

const { message } = validation

export default yup.object().shape({
  message,
})
