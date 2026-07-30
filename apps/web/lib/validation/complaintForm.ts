import * as yup from 'yup'
import { validation } from '@recycl/shared'

const { validationMessages, notOnlySpaces } = validation
const { required, maxLength, minLength } = validationMessages

export const complaintFormSchema = yup.object({
  complaint: yup
    .string()
    .concat(notOnlySpaces)
    .min(10, minLength)
    .max(50, maxLength)
    .required(required),
  complaintUrl: yup
    .string()
    .min(1, minLength)
    .max(2048, maxLength)
    .required(required),
})
