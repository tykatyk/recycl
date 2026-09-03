import { Button, Box } from '@mui/material'
import { Formik, Form, Field } from 'formik'
import TextFieldFormik from '../formInputs/TextFieldFormik'
import ButtonSubmittingCircle from '../ButtonSubmittingCircle'
import { enqueueSnackbar } from 'notistack'
import { email as emailValidator } from '@recycl/shared/dist/validation'
import * as yup from 'yup'
import { useTranslations } from 'next-intl'
import { ApiResponseStatus } from '../../../lib/helpers/responses'
import {
  responseStatuses,
  validateForm,
} from '../../../lib/helpers/errorHelpers'

const { ERROR } = responseStatuses
const api = '/api/my/account/email'

export default function PhoneForm() {
  const t = useTranslations('AccountSettings.ChangeEmailForm')
  const tValidationMessages = useTranslations('ValidationMessages')

  return (
    <Box>
      <Formik
        initialValues={{
          email: '',
        }}
        validate={async (values) => {
          return await validateForm({
            values,
            validationSchema: yup.object({
              email: emailValidator,
            }),
            translations: tValidationMessages,
          })
        }}
        onSubmit={async (values) => {
          try {
            const response = await fetch(api, {
              method: 'POST',
              body: JSON.stringify(values),
              headers: {
                'Content-Type': 'application/json',
              },
            })

            if (response.ok) {
              enqueueSnackbar(t('successMessage'), {
                variant: 'success',
              })
              return
            }

            const data: ApiResponseStatus = await response.json()
            if (data.status !== ERROR) {
              throw new Error(t('errorMessage'))
            }

            const { error } = data

            if (error.code === 'EEXISTS') {
              enqueueSnackbar(t('emailInUse'), {
                variant: 'error',
              })
              return
            }
            if (error.code === 'ESAME_VALUE') {
              enqueueSnackbar(t('emailTheSameAsCurrent'), {
                variant: 'error',
              })
              return
            }

            throw new Error(t('errorMessage'))
          } catch (error) {
            enqueueSnackbar(t('errorMessage'), {
              variant: 'error',
            })
          }
        }}
      >
        {({ isSubmitting }) => {
          return (
            <Form noValidate autoComplete="off">
              <Box sx={{ mb: 2 }}>
                <Field
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  id="email"
                  label={t('label')}
                  name="email"
                  component={TextFieldFormik}
                />
              </Box>
              <Box>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={isSubmitting}
                  style={{ width: 'auto' }}
                >
                  {t('submit')}
                  {isSubmitting && <ButtonSubmittingCircle />}
                </Button>
              </Box>
            </Form>
          )
        }}
      </Formik>
    </Box>
  )
}
