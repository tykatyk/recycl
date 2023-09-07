import * as yup from 'yup'

import {
  phone,
  wasteLocation,
  wasteType,
  comment,
  time,
  date,
} from './atomicValidators'

import validationMessages from './messages'
const { required } = validationMessages

export default yup.object().shape({
  location: wasteLocation,
  wasteType,
  phone: phone.required(required),
  comment,
  // date,
  startTime: time,
  endTime: time,
})
