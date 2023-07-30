import * as yup from 'yup'
import { email, password, confirmPassword } from './atomicSchemas.mjs'
import messages from './messages.mjs'

const { required } = messages

export default yup
  .object()
  .shape({
    name: yup
      .string()
      .required(required)
      .min(3, 'Минимум 3 символа')
      .max(255, 'Максимум 255 символов'),
  })
  .concat(password)
  .concat(confirmPassword)
  .concat(email)
