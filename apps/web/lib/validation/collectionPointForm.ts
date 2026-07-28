import * as yup from 'yup'
import { validation } from '@recycl/shared'
import { collectionPointTypes } from '@recycl/shared/dist/constants'

const { phone, location, wasteArray, comment, date, validationMessages } =
  validation
const { required } = validationMessages

export const collectionPointSchema = yup.object({
  variant: yup
    .string()
    .required()
    .oneOf(Object.keys(collectionPointTypes))
    .default('container'),
  date: yup.string().when('variant', {
    is: 'mobile',
    then: (schema) => {
      return date
    },
  }),
  location,
  wasteTypes: wasteArray,
  phone: phone.required(required),
  comment,
})
