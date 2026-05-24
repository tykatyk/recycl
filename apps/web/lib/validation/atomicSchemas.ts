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
  .transform((value) => (value === '' || isNaN(value) ? undefined : value))
  .integer()
  .min(0)
  .default(0)

export const paginationPageSizeSchema = yup
  .number()
  .transform((value) => (value === '' || isNaN(value) ? undefined : value))
  .integer()
  .min(rowsPerPageOptions[0])
  .max(rowsPerPageOptions[rowsPerPageOptions.length - 1] || ONE_HUNDRED)
  .default(rowsPerPageOptions[0])
