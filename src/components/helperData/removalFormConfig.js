import * as yup from 'yup'

export const initialValues = {
  wasteLocation: '',
  wasteType: '',
  quantity: 0,
  passDocumet: false,
  description: '',
  notificationCities: [],
  notificationCitiesCheckbox: false,
  notificationRadius: 0,
  notificationRadiusCheckbox: false,
}

export const validationSchema = yup.object().shape({
  wasteLocation: yup.object().required(),
  wasteType: yup.number().oneOf([1, 2, 3]),
  quantity: yup
    .number('Поле должно содержать число больше 0')
    .positive('Поле должно содержать число больше 0'),
  passDocumet: yup.boolean(),
  notificationRadiusCheckbox: yup.boolean(),
  notificationCitiesCheckbox: yup.boolean(),
})
