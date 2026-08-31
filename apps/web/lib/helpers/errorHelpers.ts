import { ValidationError } from 'yup'
import { FormikErrors, FormikHelpers, FormikValues } from 'formik'
import { Dispatch, SetStateAction } from 'react'
import {
  NextApiRequest,
  NextApiResponse,
  GetServerSideProps,
  GetServerSidePropsContext,
} from 'next'
import { validationErrorResponse } from './responses'

export const responseErrrorCodes = {
  NOT_FOUND: 'NOT_FOUND',
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

export type FormValidationError =
  | {
      type: 'perForm'
      message: string
    }
  | {
      type: 'perField'
      message: FormikErrors<FormikValues>
    }

export function mapErrors(error: ValidationError) {
  if (Array.isArray(error)) return null

  let mappedErrors: FormikErrors<FormikValues> = {}

  if (error.inner && error.inner.length > 0) {
    error.inner.forEach((item: ValidationError, i) => {
      if (!item.path) return
      const path = item.path.split('.')[0]
      if (!path) return
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
  switch (error.type) {
    case 'perField':
      setErrors(error.message)
      break

    case 'perForm':
      setNotification(error.message)
      break

    default:
      setNotification(responseErrrorCodes.INTERNAL_SERVER_ERROR)
  }
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

type Callback<P extends { [key: string]: any }> = (
  context: GetServerSidePropsContext,
) => ReturnType<GetServerSideProps<P>>

export function getServerSidePropsHandler<P extends { [key: string]: any }>(
  callback: Callback<P>,
  redirectOnError?: string,
): GetServerSideProps<P> {
  return async (context: GetServerSidePropsContext) => {
    try {
      return await callback(context)
    } catch (e) {
      if (redirectOnError) {
        return {
          redirect: {
            destination: redirectOnError,
            permanent: false,
          },
        }
      }

      return {
        props: {} as P,
      }
    }
  }
}
