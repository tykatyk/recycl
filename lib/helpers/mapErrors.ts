import type { ValidationError } from 'yup'
import { FormikErrors, FormikValues } from 'formik'

export default function mapErrors(error: ValidationError) {
  if (Array.isArray(error)) return null

  let mappedErrors: FormikErrors<FormikValues> = {}

  if (error.inner && error.inner.length > 0) {
    error.inner.forEach((item: ValidationError, i) => {
      if (!item.path) return
      const path = item.path.split('.')[0]
      if (!mappedErrors[path]) mappedErrors[path] = item.message
    })
    return mappedErrors
  }

  return null
}
