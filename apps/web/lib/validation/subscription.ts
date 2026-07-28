import * as yup from 'yup'
import { validation } from '@recycl/shared'

export const wasteAvailableSubscriptionSchema = yup.object({
  location: validation.location,
  wasteTypes: yup
    .array()
    .of(yup.string().required(validation.validationMessages.required))
    .required()
    .min(1, (min) => `Выберите хотя бы ${min.min} элемент`),
  radius: validation.radius,
})

export const wasteRemovalSubscriptionSchema = yup.object({
  radius: validation.radius,
})
