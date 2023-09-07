import * as yup from 'yup'
import dayjs from 'dayjs'
import { phoneRegex, whitespaceRegex } from './regularExpressions'
import messages from './messages'

const {
  required,
  email: emailMsg,
  phone: phoneMsg,
  notOnlySpaces: notOnlySpacesMsg,
  maxLength,
  incorrectValue,
  dateIsSameOrAfter,
  dateIsOneYearAfterNow,
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

export const wasteLocation = yup.object().nullable().required(required)
export const wasteType = yup.string().required(required)
//ToDo: maybe restrict comment on number of min and max characters
export const comment = yup.string()
export const time = yup
  .string()
  .test('isValidTime', incorrectValue, function (value) {
    return dayjs(value, 'HH:mm', true).isValid()
  })
export const date = yup
  .string()
  .required(incorrectValue)
  .test('dateIsValid', incorrectValue, function (value) {
    return dayjs(value).isValid()
  })
  .test('dateIsSameOrAfter', dateIsSameOrAfter, function (value) {
    return dayjs().isSameOrAfter(value, 'day')
  })
  .test('dateIsOneYearAfterNow', dateIsOneYearAfterNow, function (value) {
    return dayjs().isSameOrBefore(dayjs(value).add(1, 'year'), 'day')
  })
