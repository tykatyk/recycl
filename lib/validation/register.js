import * as yup from 'yup'
import email from './email'
import password from './password'
import messages from './messages'

const { required } = messages

export default yup
  .object()
  .shape({
    username: yup
      .string()
      .required(required)
      .min(3, 'Минимум 3 символа')
      .max(255, 'Максимум 255 символов'),
  })
  .concat(password)
  .concat(email)
