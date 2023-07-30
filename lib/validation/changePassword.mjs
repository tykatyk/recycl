import * as yup from 'yup'
import { password } from './atomicSchemas.mjs'
import messages from './messages.mjs'

const { required } = messages
export default yup.object().shape({
  oldPassword: yup.string().required(required),
  newPassword: yup
    .reach(password, 'password')
    .notOneOf([yup.ref('oldPassword'), null], 'Пароли должны отличаться'),
})
