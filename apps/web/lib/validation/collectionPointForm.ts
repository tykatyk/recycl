import dayjs from 'dayjs'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import * as yup from 'yup'
import {
  phone,
  location,
  wasteArray,
  comment,
  validationMessages,
} from '@recycl/shared/dist/validation'
import { collectionPointTypes } from '@recycl/shared/dist/constants'

dayjs.extend(isSameOrAfter)
dayjs.extend(isSameOrBefore)

const { required, wrongType, dateIsSameOrAfter, dateIsOneYearAfterNow } =
  validationMessages

export const collectionPointSchema = yup.object({
  variant: yup
    .string()
    .required()
    .oneOf(collectionPointTypes)
    .default('container'),
  date: yup.string().when('variant', {
    is: 'mobile',
    then: (schema) => {
      return schema
        .typeError(wrongType)
        .required(required)
        .test('dateIsValid', wrongType, function (value) {
          return dayjs(value).isValid()
        })
        .test('dateIsSameOrAfter', dateIsSameOrAfter, function (value) {
          return dayjs(value).isSameOrAfter(dayjs())
        })
        .test('dateIsOneYearAfterNow', dateIsOneYearAfterNow, function (value) {
          return dayjs(value).isSameOrBefore(dayjs().add(1, 'year'))
        })
    },
  }),
  location,
  wasteTypes: wasteArray,
  phone: phone.required(required),
  comment,
})
