import * as yup from 'yup'
import {
  validationMessages,
  email,
  notOnlySpaces,
} from '@recycl/shared/dist/validation'

const { required, minLength, maxLength } = validationMessages

const proposeWasteTypeSchema = yup.object().shape({
  userName: yup
    .string()
    .concat(notOnlySpaces)
    .required(required)
    .min(3, minLength)
    .max(255, maxLength),
  email,
  wasteTypeToAdd: yup
    .string()
    .concat(notOnlySpaces)
    .required(required)
    .min(3, minLength)
    .max(255, maxLength),
  additionalNotes: yup
    .string()
    .concat(notOnlySpaces)
    .default('')
    .max(1000, maxLength),
})

export { proposeWasteTypeSchema }
