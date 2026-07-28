import * as yup from 'yup'
import { validation } from '@recycl/shared'

const { email } = validation

export default yup.object().shape({
  email,
})
