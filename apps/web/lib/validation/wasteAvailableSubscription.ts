import * as yup from 'yup'
import { validation } from '@recycl/shared'

export const wasteAvailableSubscriptionSchema = yup.object({
  location: validation.location,
  wasteTypes: yup
    .array()
    .of(yup.string().required(validation.validationMessages.required))
    .required()
    .min(1, (min) => `Выберите хотя бы ${min.min} элемент`),
  radius: yup
    .number()
    .required(validation.validationMessages.required)
    .min(1, (min) => `Значение не должно быть меньше ${min.min}`)
    .max(200, (max) => `Значение не должно быть больше ${max.max}`),
})
