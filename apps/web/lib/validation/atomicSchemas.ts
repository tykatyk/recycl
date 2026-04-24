import * as yup from 'yup'
import { validation } from '@recycl/shared'
const {
  location,
  phone: phoneValidator,
  email: emailValidator,
  password: passwordValidator,
  confirmPassword: confirmPasswordValidator,
} = validation

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
