import { ValidationError } from 'yup'
import { FormikErrors } from 'formik'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'

import type { FormikValues } from 'formik'
import type { ObjectSchema } from 'yup'
import type { useTranslations } from 'next-intl'

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
