import * as yup from 'yup'
import { phoneRegex } from './regularExpressions'
import messages from './messages'

const { required } = messages

export const email = yup
  .string()
  .required(required)
  .email('Недействительный адрес электронной почты')

export const location = yup.object().nullable().required(required)

export const phone = yup
  .string()
  .test('phone', 'Недействительный номер телефона', (value, context) => {
    if (!value) return true
    return phoneRegex.test(value)
  })
