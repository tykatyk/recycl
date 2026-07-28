import * as yup from 'yup'
import { validation } from '@recycl/shared'
import { rowsPerPageOptions } from '../helpers/eventHelpers'

const {
  location,
  phone: phoneValidator,
  email: emailValidator,
  password: passwordValidator,
  confirmPassword: confirmPasswordValidator,
} = validation

const ONE_HUNDRED = 100
const min = rowsPerPageOptions[0]
const max = rowsPerPageOptions[rowsPerPageOptions.length - 1] ?? ONE_HUNDRED

export const password = yup.object().shape({
  password: passwordValidator,
})

export const confirmPassword = yup.object().shape({
  confirmPassword: confirmPasswordValidator,
})

export const email = yup.object().shape({
  email: emailValidator,
})

export const phone = yup.object().shape({
  phone: phoneValidator,
})

export const userLocation = yup.object().shape({
  userLocation: location,
})

export const paginationPageNumberSchema = yup
  .number()
  .transform((value) =>
    value === '' || isNaN(value) ? undefined : Math.max(value, 1),
  )
  .integer()
  .min(1)
  .default(1)

export const paginationPageSizeSchema = yup
  .number()
  .transform((value) => {
    if (value === '' || isNaN(value)) {
      return undefined
    }

    return Math.min(Math.max(value, min), max)
  })
  .integer()
  .default(min)
