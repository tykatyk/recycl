import * as yup from 'yup'
import messages from './messages.js'
import { phone } from './atomicValidators.js'

const { required, type, positive } = messages

export default yup.object().shape({
  wasteLocation: yup.object().nullable().required(required),
  wasteType: yup.string().required(required),
  quantity: yup.number().typeError(type).positive(positive).required(required),
  contactPhone: phone.required(required),
  comment: yup.string(),
  notificationRadiusCheckbox: yup.boolean(),
  notificationRadius: yup.number().when('notificationRadiusCheckbox', {
    is: true,
    then: yup
      .number()
      .typeError(type)
      .positive(positive)
      .required('Заполните это поле'),
  }),
  notificationCitiesCheckbox: yup.boolean(),
  notificationCities: yup.array().when('notificationCitiesCheckbox', {
    is: true,
    then: yup.array().typeError(type).min(1, 'Заполните это поле'),
  }),
})
