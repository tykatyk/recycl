import * as yup from 'yup'
import { validation } from '@recycl/shared'

const { password, validationMessages } = validation

const { required } = validationMessages
export default yup.object().shape({
  oldPassword: yup.string().required(required),
  newPassword: yup
    .string()
    .concat(password)
    .notOneOf([yup.ref('oldPassword'), null], 'Пароли должны отличаться'),
})
