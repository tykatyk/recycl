import * as yup from 'yup'
import { validation } from '@recycl/shared'
import type { PlaceType } from '../types/placeAutocomplete'

const { validationMessages } = validation

export const adSearchFormSchema = yup.object({
  wasteLocation: yup.mixed<PlaceType>().nullable(),
  wasteType: yup.string().nullable(),
  searchType: yup.string().oneOf(['point', 'radius']),
  searchRadius: yup
    .number()
    .nullable()
    .min(1, (min) => `Значение не должно быть меньше ${min.min}`)
    .max(200, (max) => `Значение не должно быть больше ${max.max}`)
    .when('searchType', {
      is: 'radius',
      then: (schema) => schema.required(validationMessages.required),
      otherwise: (schema) => schema.notRequired(),
    }),
})
