import * as yup from 'yup'
import dayjs from 'dayjs'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import { phoneRegex, whitespaceRegex } from './regularExpressions'
import messages from './messages'

dayjs.extend(isSameOrAfter)
dayjs.extend(isSameOrBefore)

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
export const phone = yup
  .string()
  .min(10, phoneMsg)
  .matches(phoneRegex, phoneMsg)
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
  .object()
  .nullable()
  .test('timeisValid', incorrectValue, function (value) {
    if (value && Object.keys(value).length === 0) {
      return true
    }
    if (value) {
      return dayjs.isDayjs(value) && dayjs(value).isValid()
    }
    return true
  })
export const date = yup
  .object()
  .typeError(incorrectValue)
  .required(incorrectValue)
  .test('dateIsValid', incorrectValue, function (value) {
    return dayjs(value).isValid()
  })
  .test('dateIsSameOrAfter', dateIsSameOrAfter, function (value) {
    return dayjs(value).isSameOrAfter(dayjs(), 'day')
  })
  .test('dateIsOneYearAfterNow', dateIsOneYearAfterNow, function (value) {
    return dayjs(value).isSameOrBefore(dayjs().add(1, 'year'), 'day')
  })
