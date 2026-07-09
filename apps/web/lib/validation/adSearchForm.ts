import * as yup from 'yup'
import { validation } from '@recycl/shared'
import type { PlaceType } from '../types/placeAutocomplete'

const { validationMessages } = validation

export const adSearchFormSchema = yup.object({
  wasteLocation: yup.mixed<PlaceType>().nullable(),
  wasteType: yup.string().nullable(),
  searchRadius: yup
    .number()
    .nullable()
    .when('wasteLocation', {
      is: (val) => !!val == true,
      then: (schema) =>
        schema
          .required(validationMessages.required)
          .min(0, (min) => `Значение не должно быть меньше ${min.min}`)
          .max(200, (max) => `Значение не должно быть больше ${max.max}`),
      otherwise: (schema) => schema.notRequired(),
    }),
})
