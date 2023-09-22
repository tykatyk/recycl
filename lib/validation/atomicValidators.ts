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
  minLength,
  incorrectValue,
  dateIsSameOrAfter,
  dateIsOneYearAfterNow,
  endTimeIsGreaterThanStartTime,
  timeisNotOverdue,
} = messages

export const password = yup
  .string()
  .required(required)
  .min(6, minLength)
  .max(255, maxLength)

export const confirmPassword = yup
  .string()
  .required(required)
  .oneOf([yup.ref('password'), null], 'Пароли не совпадают!')

export const email = yup.string().required(required).email(emailMsg)

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

export const comment = yup
  .string()
  .min(10, minLength)
  .max(1000, maxLength)
  .concat(notOnlySpaces)

export const location = yup
  .object({
    main_text: yup.string().typeError(incorrectValue).required(required),
    place_id: yup.string().typeError(incorrectValue).required(required),
  })
  .nullable()
  .required(required)

export const wasteLocation = yup
  .object({
    _id: yup.string().typeError(incorrectValue).required(required),
    name: yup.string().typeError(incorrectValue).required(required),
  })
  .nullable()
  .required(required)

export const wasteType = yup
  .object({
    _id: yup.string().typeError(incorrectValue).required(required),
    name: yup.string().typeError(incorrectValue).required(required),
  })
  .required(required)
  .typeError(incorrectValue)

export const startTime = yup
  .string()
  .nullable()
  .test('timeisValid', incorrectValue, function (value) {
    if (value) {
      return dayjs(value).isValid()
    }
    return true
  })
  .test('timeisNotOverdue', timeisNotOverdue, function (value) {
    const { date } = this.parent
    if (value && date) {
      return dayjs(date)
        .set('hour', dayjs(value).get('hour'))
        .set('minute', dayjs(value).get('minute'))
        .set('second', dayjs(value).get('second'))
        .isSameOrAfter(dayjs())
    }
    return true
  })

export const endTime = startTime.test(
  'endTimeIsGreaterThanStartTime',
  endTimeIsGreaterThanStartTime,
  function (value) {
    const { startTime } = this.parent
    if (value && startTime) {
      return dayjs(value).isSameOrAfter(dayjs(startTime))
    }
    return true
  }
)

export const date = yup
  .string()
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
