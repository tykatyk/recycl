import * as yup from 'yup'
import email from './email'
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
    password: yup
      .string()
      .required(required)
      .min(6, 'Минимум 6 символов')
      .max(255, 'Максимум 255 символов'),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref('password'), null], 'Пароли не совпадают!')
      .required(required),
  })
  .concat(email)
