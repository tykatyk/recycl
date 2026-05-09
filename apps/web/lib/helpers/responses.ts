import { NextApiResponse } from 'next'
import { mapErrors } from './errorHelpers'
import type { FormValidationError } from '../types/error'
import type { ValidationError } from 'yup'

type ErrorResponse = { error: FormValidationError }

export const perFormErrorResponse = function (
  message: string,
  res: NextApiResponse<ErrorResponse>,
) {
  res.status(422).json({
    error: {
      type: 'perForm',
      message,
    },
  })
}

export const validationErrorResponse = function (
  error: ValidationError,
  res: NextApiResponse<ErrorResponse>,
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
    perFormErrorResponse('Ошибка при проверке данных формы', res)
  }
}

export const captchaNotPassedResponse = function (
  res: NextApiResponse<ErrorResponse>,
) {
  return res.status(401).json({
    error: {
      type: 'perForm',
      message: 'Пожалуйста, подтвердите что вы не робот',
    },
  })
}

export const unsubscribeApiResponseCodes = {
  NOT_FOUND: 'NOT_FOUND',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  TOKEN_USED: 'TOKEN_USED',
  SUCCESS: 'SUCCESS',
} as const
