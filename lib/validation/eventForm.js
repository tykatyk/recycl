import * as yup from 'yup'

import {
  phone,
  wasteLocation,
  wasteType,
  comment,
  startTime,
  endTime,
  date,
} from './atomicValidators'

import validationMessages from './messages'
const { required } = validationMessages

export default yup.object().shape({
  location: wasteLocation,
  wasteType,
  phone: phone.required(required),
  comment,
  date,
  startTime,
  endTime,
})
