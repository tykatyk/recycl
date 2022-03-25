import * as yup from 'yup'
import { phoneRegex } from './regularExpressions'
import messages from './messages'

const {
  required,
  email: emailMsg,
  phone: phoneMsg,
} = messages

export const email = yup.string().required(required).email(emailMsg)
export const location = yup.object().nullable().required(required)
export const phone = yup.string().matches(phoneRegex, phoneMsg)
