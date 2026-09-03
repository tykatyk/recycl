import { ValidationError } from 'yup'
import { FormikErrors, FormikHelpers } from 'formik'
import { Dispatch, SetStateAction } from 'react'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'

import type { FormikValues } from 'formik'
import type { ObjectSchema } from 'yup'
import type { useTranslations } from 'next-intl'

export const responseErrrorCodes = {
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

export type FormValidationError =
  | {
      type: 'perForm'
      message: string
    }
  | {
      type: 'perField'
      message: FormikErrors<FormikValues>
    }

function translateError(
  error: ValidationError,
  translations: ReturnType<typeof useTranslations>,
) {
  //ToDo: change any type
  if (!error.params) return translations(error.message as any)

  return translations(error.message as any, error.params as any)
}

type ValidateParams<T extends FormikValues> = {
  values: T
  validationSchema: ObjectSchema<T>
  translations: ReturnType<typeof useTranslations>
}

export async function validateForm<T extends FormikValues>(
  params: ValidateParams<T>,
) {
  const { values, validationSchema, translations } = params

  try {
    await validationSchema.validate(values, {
      abortEarly: false,
    })

    return {}
  } catch (error) {
    if (!(error instanceof ValidationError)) {
      //maybe throw
      return {}
    }
    return error.inner.reduce<Record<string, string>>(
      (errors, validationError) => {
        if (validationError.path && !errors[validationError.path]) {
          errors[validationError.path] = translateError(
            validationError,
            translations,
          )
        }

        return errors
      },
      {},
    )
  }
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
