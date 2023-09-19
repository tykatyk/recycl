import { FormikErrors, FormikValues } from 'formik'

export type ApiError =
  | {
      type: 'perForm'
      message: string
    }
  | {
      type: 'perField'
      message: FormikErrors<FormikValues>
    }
