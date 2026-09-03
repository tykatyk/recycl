import { NextApiRequest, NextApiResponse } from 'next'

export const responseErrorCodes = {
  NOT_FOUND: 'NOT_FOUND',
  EEXISTS: 'EEXISTS',
  ESAME_VALUE: 'ESAME_VALUE',
  EXPIRED: 'EXPIRED',
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  METHOD_NOT_ALLOWED: 'METHOD_NOT_ALLOWED',
  FORBIDDEN: 'FORBIDDEN',
  CAPTCHA_FAILED: 'CAPTCHA_FAILED',
} as const

export const responseStatuses = {
  ERROR: 'ERROR',
  SUCCESS: 'SUCCESS',
} as const

const { CAPTCHA_FAILED } = responseErrorCodes
const { SUCCESS, ERROR } = responseStatuses

type ErrorResponse = {
  status: typeof ERROR
  error: {
    code: keyof typeof responseErrorCodes
    message: string
  }
}

type SuccessResponse = {
  status: typeof SUCCESS
}

export type ApiResponseStatus = ErrorResponse | SuccessResponse

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

      res.status(500).json({
        status: responseStatuses.ERROR,
        error: {
          code: responseErrorCodes.INTERNAL_SERVER_ERROR,
          message: responseErrorCodes.INTERNAL_SERVER_ERROR,
        },
      })
    }
  }
