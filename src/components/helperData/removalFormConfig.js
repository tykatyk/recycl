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

export const validationSchema = yup.object().shape({
  wasteLocation: yup.object().nullable().required('*Обязательное поле'),
  wasteType: yup.number().required('*Обязатльное поле'),
  quantity: yup
    .number()
    .typeError('Поле должно содержать число больше 0')
    .positive('Поле должно содержать число больше 0')
    .required('*Обязательне поле'),
  notificationRadiusCheckbox: yup.boolean(),
  notificationRadius: yup.number().when('notificationRadiusCheckbox', {
    is: true,
    then: yup
      .number()
      .typeError('Поле должно содержать число больше 0')
      .positive('Поле должно содержать число больше 0')
      .required('Поле должно содержать число больше 0'),
  }),
  notificationCitiesCheckbox: yup.boolean(),
  notificationCities: yup.number().when('notificationCitiesCheckbox', {
    is: true,
    then: yup
      .number()
      .typeError('Поле должно содержать число больше 0')
      .positive('Поле должно содержать число больше 0')
      .required('Поле должно содержать число больше 0'),
  }),
})
