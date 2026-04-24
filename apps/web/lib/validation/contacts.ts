import * as yup from 'yup'
import { validation } from '@recycl/shared'

const { validationMessages } = validation
const { required } = validationMessages

export default yup.object().shape({
  username: yup
    .string()
    .required(required)
    .min(3, 'Минимум 3 символа')
    .max(255, 'Максимум 255 символов'),
  location: yup.object().nullable(),
})
