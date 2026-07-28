import * as yup from 'yup'
import { validation } from '@recycl/shared'

const { phone, location, notOnlySpaces, validationMessages } = validation
const { required, type, positive, minLength, maxLength } = validationMessages

export default yup.object().shape({
  title: yup
    .string()
    .concat(notOnlySpaces)
    .required(required)
    .min(10, minLength)
    .max(255, maxLength),
  wasteLocation: location,
  wasteType: yup.string().required(required),
  quantity: yup.number().typeError(type).positive(positive).required(required),
  contactPhone: phone.required(required),
  comment: yup.string(),
  notificationRadiusCheckbox: yup.boolean(),
  notificationRadius: yup.number().when('notificationRadiusCheckbox', {
    is: true,
    then: (numberSchema) => {
      return numberSchema
        .typeError(type)
        .positive(positive)
        .required('Заполните это поле')
    },
  }),
  notificationCitiesCheckbox: yup.boolean(),
  notificationCities: yup.array().when('notificationCitiesCheckbox', {
    is: true,
    then: (arraySchema) => {
      return arraySchema.typeError(type).min(1, 'Заполните это поле')
    },
  }),
})
