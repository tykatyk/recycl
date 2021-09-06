import * as yup from 'yup'

export const initialValues = {
  wasteLocation: '',
  wasteType: '',
  quantity: '',
  passDocumet: false,
  description: '',
  notificationCities: [],
  notificationCitiesCheckbox: false,
  notificationRadius: '',
  notificationRadiusCheckbox: false,
}

const required = '*Обязательное поле'
const type = 'Поле имеет неверный тип данных'
const positive = 'Поле должно содержать число больше 0'

export const validationSchema = yup.object().shape({
  wasteLocation: yup.object().nullable().required(required),
  wasteType: yup.number().required(required),
  quantity: yup.number().typeError(type).positive(positive).required(required),
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
