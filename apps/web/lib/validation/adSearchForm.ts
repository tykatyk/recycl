import * as yup from 'yup'
import { radius } from '@recycl/shared/dist/validation'
import type { PlaceType } from '../types/placeAutocomplete'

export const adSearchFormSchema = yup.object({
  wasteLocation: yup.mixed<PlaceType>().nullable(),
  wasteType: yup.string().nullable(),
  searchRadius: yup
    .number()
    .nullable()
    .when('wasteLocation', {
      is: (val) => !!val == true,
      then: () => radius,
      otherwise: (schema) => schema.notRequired(),
    }),
})
