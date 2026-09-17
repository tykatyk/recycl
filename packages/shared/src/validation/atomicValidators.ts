import * as yup from 'yup'
import { phoneRegex, whitespaceRegex } from './regularExpressions.js'
import { validationMessages } from './messages.js'
import { minRadius, maxRadius, wasteTypeNames } from '../constants.js'

const {
  required,
  email: emailMsg,
  phone: phoneMsg,
  notOnlySpaces: notOnlySpacesMsg,
  wrongType,
  onlyIntegers,
  onlyDigits,
  atLeastOne,
  maxLength,
  minLength,
  maxNumber,
  minNumber,
  oneOf,
} = validationMessages

const email = yup.string().required(required).email(emailMsg)

const phone = yup
  .string()
  .required(required)
  .min(10, phoneMsg)
  .matches(phoneRegex, phoneMsg)

const notOnlySpaces = yup
  .string()
  .test('notOnlySpaces', notOnlySpacesMsg, (value, context) => {
    if (!value) return true
    return value.replace(whitespaceRegex, '') !== ''
  })

const userName = yup
  .string()
  .required(required)
  .concat(notOnlySpaces)
  .min(3, minLength)
  .max(255, maxLength)

const comment = yup
  .string()
  .concat(notOnlySpaces)
  .min(5, minLength)
  .max(1000, maxLength)

const radius = yup
  .number()
  .typeError(onlyDigits)
  .integer(onlyIntegers)
  .required(required)
  .min(minRadius, minNumber)
  .max(maxRadius, maxNumber)

const location = yup
  .object({
    description: yup.string().typeError(wrongType).required(required),
    place_id: yup.string().typeError(wrongType).required(required),
    structured_formatting: yup
      .object({
        main_text: yup.string().typeError(wrongType).required(required),
        secondary_text: yup.string().typeError(wrongType),
      })
      .required(required)
      .typeError(wrongType),
  })
  .nullable()
  .required(required)

// const location = yup.object().nullable().required(required)

const waste = yup
  .mixed<(typeof wasteTypeNames)[number]>()
  .oneOf(wasteTypeNames, oneOf)
  .required(required)
  .typeError(wrongType)

const wasteArray = yup
  .array()
  .of(
    yup
      .mixed<(typeof wasteTypeNames)[number]>()
      .oneOf(wasteTypeNames, oneOf)
      .required(required)
      .typeError(wrongType),
  )
  .min(1, atLeastOne)
  .required(required)
  .typeError(wrongType)

export {
  email,
  phone,
  userName,
  notOnlySpaces,
  comment,
  radius,
  location,
  waste,
  wasteArray,
}
