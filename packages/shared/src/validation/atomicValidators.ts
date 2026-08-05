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

const phone = yup
  .string()
  .required(required)
  .min(10, phoneMsg)
  .matches(phoneRegex, phoneMsg)

const userName = yup
  .string()
  .required(required)
  .min(3, 'Минимум 3 символа')
  .max(255, 'Максимум 255 символов')

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

const radius = yup
  .number()
  .typeError('Введите целое цисло')
  .required(required)
  .min(1, (min) => `Значение не должно быть меньше ${min.min}`)
  .max(200, (max) => `Значение не должно быть больше ${max.max}`)

const location = yup
  .object({
    description: yup.string().typeError(incorrectValue).required(required),
    place_id: yup.string().typeError(incorrectValue).required(required),
    structured_formatting: yup
      .object({
        main_text: yup.string().typeError(incorrectValue).required(required),
        secondary_text: yup.string().typeError(incorrectValue).notRequired(),
      })
      .required(required)
      .typeError(incorrectValue),
  })
  .nullable()
  .required(required)

// const location = yup.object().nullable().required(required)

const waste = yup.string().required(required).typeError(incorrectValue)
const wasteArray = yup
  .array()
  .of(yup.string())
  .min(1, 'Выберите хотя бы 1 значение')
  .required(required)
  .typeError(incorrectValue)

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
  userName,
  notOnlySpaces,
  message,
  comment,
  radius,
  location,
  waste,
  wasteArray,
  date,
}
