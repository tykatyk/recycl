import * as yup from 'yup'
import {
  location,
  phone as phoneValidator,
  email as emailValidator,
  password as passwordValidator,
  confirmPassword as confirmPasswordValidator,
} from './atomicValidators'

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
