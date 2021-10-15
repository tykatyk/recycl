import * as yup from 'yup'

const required = '*Обязательное поле'
const type = 'Поле имеет неверный тип данных'
const positive = 'Поле должно содержать число больше 0'

export const validationSchema = yup.object().shape({
  wasteLocation: yup.object().nullable().required(required),
  wasteType: yup.string().required(required),
  quantity: yup.number().typeError(type).positive(positive).required(required),
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

export function getInitialValues() {
  return {
    wasteLocation: null,
    wasteType: '',
    quantity: '',
    comment: '',
    passDocumet: false,
    notificationCities: [],
    notificationCitiesCheckbox: false,
    notificationRadius: '',
    notificationRadiusCheckbox: false,
  }
}

export function getNormalizedValues(values) {
  const normalizedValues = {}
  Object.assign(normalizedValues, values)

  const wasteLocation = {
    description: values.wasteLocation.description,
    place_id: values.wasteLocation.place_id,
    structured_formatting: values.wasteLocation.structured_formatting,
  }

  normalizedValues.wasteLocation = wasteLocation

  const notificationCities = values.notificationCities.map((item) => {
    const normalizedItem = {}
    normalizedItem.description = item.description
    normalizedItem.place_id = item.place_id
    normalizedItem.structured_formatting = item.structured_formatting
    return normalizedItem
  })
  normalizedValues.notificationCities = notificationCities

  return normalizedValues
}
