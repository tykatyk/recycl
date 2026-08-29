import * as yup from 'yup'
import { email, validationMessages } from '@recycl/shared/dist/validation'

const { required, minLength, maxLength } = validationMessages

export default yup.object().shape({
  name: yup.string().required(required).min(3, minLength).max(255, maxLength),
  email,
})
