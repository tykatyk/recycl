import { NextApiResponse } from 'next'
import type { ValidationError } from 'yup'
import { responseErrrorCodes, responseStatuses } from './errorHelpers'

const { VALIDATION_ERROR, CAPTCHA_FAILED } = responseErrrorCodes
const { SUCCESS, ERROR } = responseStatuses

type ErrorResponse = {
  status: typeof ERROR
  error: {
    code: keyof typeof responseErrrorCodes
    message: string
  }
}

type SuccessResponse = {
  status: typeof SUCCESS
}

export type ApiResponseStatus = ErrorResponse | SuccessResponse

export const validationErrorResponse = function (
  error: ValidationError,
  res: NextApiResponse<ErrorResponse>,
) {
  return res.status(422).json({
    status: ERROR,
    error: {
      code: VALIDATION_ERROR,
      message: VALIDATION_ERROR,
    },
  })
}

export const captchaNotPassedResponse = function (
  res: NextApiResponse<ErrorResponse>,
) {
  return res.status(400).json({
    status: ERROR,
    error: {
      code: CAPTCHA_FAILED,
      message: CAPTCHA_FAILED,
    },
  })
}
