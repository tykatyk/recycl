import { NextApiRequest, NextApiResponse } from 'next'
import { ValidationError } from 'yup'
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
  message?: string,
) {
  return res.status(422).json({
    status: ERROR,
    error: {
      code: VALIDATION_ERROR,
      message: message || VALIDATION_ERROR,
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

export const apiHandler =
  (
    handler: (
      req: NextApiRequest,
      res: NextApiResponse,
    ) => Promise<void | NextApiResponse<any>>,
    allowValidationErrorsOnFrontend: boolean = false,
  ) =>
  async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      await handler(req, res)
    } catch (e) {
      if (
        process.env.NODE_ENV === 'development' ||
        process.env.VERCEL_ENV === 'development'
      ) {
        console.error(e)
      } else {
        console.error(
          `[${new Date().toISOString()}] ${req.method} ${req.url} failed:`,
        )
      }

      if (e instanceof ValidationError && allowValidationErrorsOnFrontend) {
        return validationErrorResponse(e, res)
      }
      res.status(500).json({
        status: responseStatuses.ERROR,
        error: {
          code: responseErrrorCodes.INTERNAL_SERVER_ERROR,
          message: responseErrrorCodes.INTERNAL_SERVER_ERROR,
        },
      })
    }
  }
