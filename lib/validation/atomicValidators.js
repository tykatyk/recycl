import * as yup from 'yup'
import { phoneRegex, whitespaceRegex } from './regularExpressions'
import messages from './messages'

const {
  required,
  email: emailMsg,
  phone: phoneMsg,
  notOnlySpaces: notOnlySpacesMsg,
  maxLength,
} = messages

export const email = yup.string().required(required).email(emailMsg)
export const location = yup.object().nullable().required(required)
export const phone = yup.string().matches(phoneRegex, phoneMsg)
export const notOnlySpaces = yup
  .string()
  .test('notOnlySpaces', notOnlySpacesMsg, (value, context) => {
    if (!value) return true
    return value.replace(whitespaceRegex, '') !== ''
  })
export const message = yup
  .string()
  .max(1000, maxLength)
  .concat(notOnlySpaces)
  .required(required)
