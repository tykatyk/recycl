import * as yup from 'yup'
import messages from './messages'

const { required } = messages

export default yup.object().shape({
  email: yup
    .string()
    .required(required)
    .email('Недействительный адрес электронной почты'),
  password: yup
    .string()
    .required(required)
    .min(6, 'Минимум 6 символов')
    .max(255, 'Максимум 255 символов'),
})
