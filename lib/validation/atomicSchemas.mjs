import * as yup from 'yup'
import {
  location,
  phone as phoneValidator,
  email as emailValidator,
} from './atomicValidators.mjs'
import messages from './messages.mjs'

const { required } = messages

export const password = yup.object().shape({
  password: yup
    .string()
    .required(required)
    .min(6, 'Минимум 6 символов')
    .max(255, 'Максимум 255 символов'),
})

export const confirmPassword = yup.object().shape({
  confirmPassword: yup
    .string()
    .required(required)
    .oneOf([yup.ref('password'), null], 'Пароли не совпадают!'),
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
