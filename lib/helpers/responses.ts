import { NextApiResponse } from 'next'
import mapErrors from './mapErrors'
import type { ApiError } from '../types/error'
import type { ValidationError } from 'yup'

type ErrorResponse = { error: ApiError }

export const perFormErrorResponse = function (
  message = 'Неизвестная ошибка',
  res: NextApiResponse<ErrorResponse>
) {
  res.status(500).json({
    error: {
      type: 'perForm',
      message,
    },
  })
}

export const errorResponse = function (
  error: ValidationError,
  res: NextApiResponse<ErrorResponse>
) {
  let mappedErrors = mapErrors(error)
  if (mappedErrors) {
    return res.status(422).json({
      error: {
        type: 'perField',
        message: mappedErrors,
      },
    })
  } else {
    perFormErrorResponse('Возникла ошибка при проверке данных формы', res)
  }
}

export const captchaNotPassedResponse = function (
  res: NextApiResponse<ErrorResponse>
) {
  return res.status(401).json({
    error: {
      type: 'perForm',
      message: 'Пожалуйста, подтвердите что вы не робот',
    },
  })
}
