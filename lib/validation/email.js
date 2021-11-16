import * as yup from 'yup'
import messages from './messages'

const { required } = messages

export default yup.object().shape({
  email: yup
    .string()
    .required(required)
    .email('Недействительный адрес электронной почты'),
})
