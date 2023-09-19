import { FormikHelpers, FormikValues } from 'formik'
import type { ApiError } from '../types/error'
import { Dispatch, SetStateAction } from 'react'

export default function showErrorMessages(
  error: ApiError,
  setErrors: FormikHelpers<FormikValues>['setErrors'],
  setNotification: Dispatch<SetStateAction<string>>
) {
  if (!error) return
  if (error.type === 'perField') {
    setErrors(error.message)
    return
  }
  if (error.type === 'perForm') {
    setNotification(error.message)
    return
  }

  setNotification('Неизвестная ошибка при обработке ответа сервера')
}
