import { FormikErrors, FormikValues } from 'formik'

export type FormValidationError =
  | {
      type: 'perForm'
      message: string
    }
  | {
      type: 'perField'
      message: FormikErrors<FormikValues>
    }
