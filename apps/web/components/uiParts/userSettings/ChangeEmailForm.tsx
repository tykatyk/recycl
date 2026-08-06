import { Button, Box } from '@mui/material'
import { Formik, Form, Field } from 'formik'
import TextFieldFormik from '../formInputs/TextFieldFormik'
import ButtonSubmittingCircle from '../ButtonSubmittingCircle'
import { enqueueSnackbar } from 'notistack'
import { email as emailValidator } from '@recycl/shared/dist/validation'
import * as yup from 'yup'

const errorMessage = 'Что то пошло не так'
const api = '/api/my/account/email'

export default function PhoneForm() {
  return (
    <Box>
      <Formik
        initialValues={{
          email: '',
        }}
        validationSchema={yup.object({
          email: emailValidator,
        })}
        onSubmit={async (values, { setErrors }) => {
          try {
            const response = await fetch(api, {
              method: 'POST',
              body: JSON.stringify(values),
              headers: {
                'Content-Type': 'application/json',
              },
            })

            if (response.status === 200) {
              enqueueSnackbar(
                'Письмо подтверждения отправлено на новый адрес',
                {
                  variant: 'success',
                },
              )
              return
            }

            const data = await response.json()
            const { error } = data

            if (error.type === 'perField') {
              setErrors(error.message)
              return
            }
            if (error.type === 'perForm') {
              enqueueSnackbar(error.message, {
                variant: 'error',
              })
              return
            }
            enqueueSnackbar(errorMessage, {
              variant: 'error',
            })
            return
          } catch (error) {
            enqueueSnackbar(errorMessage, {
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
                  label="Новый email адрес"
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
                  Сохранить
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
