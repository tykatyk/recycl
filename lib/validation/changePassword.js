import * as yup from 'yup'
import { password } from './atomicValidators'
import messages from './messages'

const { required } = messages
export default yup.object().shape({
  oldPassword: yup.string().required(required),
  newPassword: yup
    .string()
    .concat(password)
    .notOneOf([yup.ref('oldPassword'), null], 'Пароли должны отличаться'),
})
