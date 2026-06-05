import * as yup from 'yup'
import { validation } from '@recycl/shared'
import { email } from '@recycl/shared/dist/validation'
import { whitespaceRegex } from '@recycl/shared/dist/validation/regularExpressions'

const { validationMessages } = validation
const { required } = validationMessages

const minReadableCharsMessage = 'Минимум 3 символа'

const stringValidator = yup
  .string()
  .required(required)
  .test('minReadableChars', minReadableCharsMessage, (value) => {
    return value.replace(whitespaceRegex, '').length >= 3
  })
  .max(255, 'Максимум 255 символов')

const addWasteTypeSchema = yup.object().shape({
  userName: stringValidator,
  email,
  wasteTypeToAdd: stringValidator,
  additionalNotes: yup
    .string()
    .default('')
    .test('minReadableCharsAndEmpty', minReadableCharsMessage, (value) => {
      if (!value) return true
      return value.replace(whitespaceRegex, '').length >= 3
    }),
})

export { addWasteTypeSchema }
