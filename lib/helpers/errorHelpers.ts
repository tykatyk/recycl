import type { ValidationError } from 'yup'
import { FormikErrors, FormikHelpers, FormikValues } from 'formik'
import type { FormValidationError } from '../types/error'
import { Dispatch, SetStateAction } from 'react'

const UNKNOW_SERVER_ERROR = 'Неизвестная ошибка при обработке ответа сервера'

export function mapErrors(error: ValidationError) {
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

export function showErrorMessages(
  error: FormValidationError,
  setErrors: FormikHelpers<FormikValues>['setErrors'],
  setNotification: Dispatch<SetStateAction<string>>,
) {
  if (!error) return

  switch (error.type) {
    case 'perField':
      setErrors(error.message)
      break

    case 'perForm':
      setNotification(error.message)
      break

    default:
      setNotification(UNKNOW_SERVER_ERROR)
  }
}
