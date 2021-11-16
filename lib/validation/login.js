import * as yup from 'yup'
import messages from './messages'
import email from './email'

const { required } = messages

export default yup
  .object()
  .shape({
    password: yup.string().required(required),
  })
  .concat(email)
