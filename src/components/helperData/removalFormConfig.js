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
  wasteLocation: yup.object().required('*Обязательное поле'),
  wasteType: yup
    .number()
    .oneOf([0, 1, 2], 'Выберите одно из значений в списке'),
  quantity: yup
    .number()
    .typeError('Поле должно содержать число больше 0')
    .positive('Поле должно содержать число больше 0')
    .required('*Обязательне поле'),
  passDocumet: yup.boolean(),
  notificationRadiusCheckbox: yup.boolean(),
  notificationCitiesCheckbox: yup.boolean(),
})
