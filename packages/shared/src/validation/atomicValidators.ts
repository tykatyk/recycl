import * as yup from 'yup'
import dayjs from 'dayjs'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import { phoneRegex, whitespaceRegex } from './regularExpressions'
import { validationMessages } from './messages'

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
} = validationMessages

const password = yup
  .string()
  .required(required)
  .min(6, minLength)
  .max(255, maxLength)

const confirmPassword = yup
  .string()
  .required(required)
  .oneOf([yup.ref('password')], 'Пароли не совпадают!')

const email = yup.string().required(required).email(emailMsg)

const phone = yup.string().min(10, phoneMsg).matches(phoneRegex, phoneMsg)

const notOnlySpaces = yup
  .string()
  .test('notOnlySpaces', notOnlySpacesMsg, (value, context) => {
    if (!value) return true
    return value.replace(whitespaceRegex, '') !== ''
  })

const message = yup
  .string()
  .max(1000, maxLength)
  .concat(notOnlySpaces)
  .required(required)

const comment = yup
  .string()
  // .min(10, minLength)
  .max(1000, maxLength)
  .concat(notOnlySpaces)

const location = yup
  .object({
    description: yup.string().typeError(incorrectValue).required(required),
    place_id: yup.string().typeError(incorrectValue).required(required),
    structured_formatting: yup
      .object({
        main_text: yup.string().typeError(incorrectValue).required(required),
        secondary_text: yup
          .string()
          .typeError(incorrectValue)
          .required(required),
      })
      .required(required)
      .typeError(incorrectValue),
  })
  .nullable()
  .required(required)

// const location = yup.object().nullable().required(required)

const waste = yup.string().required(required).typeError(incorrectValue)

const date = yup
  .string()
  .typeError(incorrectValue)
  .required(incorrectValue)
  .test('dateIsValid', incorrectValue, function (value) {
    return dayjs(value).isValid()
  })
  .test('dateIsSameOrAfter', dateIsSameOrAfter, function (value) {
    return dayjs(value).isSameOrAfter(dayjs())
  })
  .test('dateIsOneYearAfterNow', dateIsOneYearAfterNow, function (value) {
    return dayjs(value).isSameOrBefore(dayjs().add(1, 'year'))
  })

export {
  password,
  confirmPassword,
  email,
  phone,
  notOnlySpaces,
  message,
  comment,
  location,
  waste,
  date,
}
