import * as yup from 'yup'
import {
  validationMessages,
  email,
  notOnlySpaces,
  comment,
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
  additionalNotes: comment.default(''),
})

export { proposeWasteTypeSchema }
