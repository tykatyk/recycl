import type { ValidationError } from 'yup'
import { FormikErrors, FormikHelpers, FormikValues } from 'formik'
import type { FormValidationError } from '../types/error'
import { Dispatch, SetStateAction } from 'react'
import { NextApiRequest, NextApiResponse } from 'next'
import message from '../db/models/message'

const INTERNAL_SERVER_ERROR = 'Ошибка сервера'

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
      setNotification(INTERNAL_SERVER_ERROR)
  }
}

type ApiErrorType = {
  status: number
  message: string
  type: string
}
export class ApiError extends Error {
  status: ApiErrorType['status']
  type: ApiErrorType['type']

  constructor(params: ApiErrorType) {
    super(params.message || INTERNAL_SERVER_ERROR)
    this.status = params.status || 500
    this.type = params.type || 'perForm'
  }
}

export const apiHandler =
  (
    handler: (
      req: NextApiRequest,
      res: NextApiResponse,
    ) => Promise<void | NextApiResponse<any>>,
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

      if (e instanceof ApiError) {
        return res
          .status(e.status)
          .json({ error: { message: e.message, type: e.type } })
      }
      res.status(500).json({
        error: INTERNAL_SERVER_ERROR,
      })
    }
  }
