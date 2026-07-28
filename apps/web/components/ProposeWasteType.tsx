import { useState, useRef } from 'react'
import { Typography, Box, Button, Container } from '@mui/material'
import { proposeWasteTypeSchema } from '../lib/validation'
import TextFieldFormik from './uiParts/formInputs/TextFieldFormik'
import ButtonSubmittingCircle from './uiParts/ButtonSubmittingCircle'
import { Formik, Form, Field, FormikHelpers } from 'formik'
import ReCAPTCHA from 'react-google-recaptcha'
import { useSnackbar } from 'notistack'
import * as yup from 'yup'
import { showErrorMessages } from '../lib/helpers/errorHelpers'

const errorMessage = 'Ошибка при отправкве формы'
const successMessage = 'Сообщение успешно отправлено'
const submitButtonText = 'Отправить'
const headerText =
  ' Если вы не нашли нужного вам типа вторсырья в списке, вы можете отправить запрос на его добавление'
const headerDetailsText =
  'О результате рассмотрения запроса, мы известим вас на электронную почту'
const addititonalNotesHeadingText = 'Примечание'
const wasteTypeToAddHeadingText = '  Тип вторсырья, который вы хотите добавить'
const emailHeadingText = 'Email для обратной связи'
const remainedSymbolsText = 'Осталось'

const apiRoute = '/api/contact-us/propose-waste-type'

export default function ProposeWasteType({ setOpen }) {
  const limit = 1000
  const [recaptchaToken, setRecaptchaToken] = useState(null)
  const recaptchaRef = useRef<ReCAPTCHA>(null)
  const { enqueueSnackbar } = useSnackbar()

  const formHandler = async (
    values: yup.InferType<typeof proposeWasteTypeSchema>,
    {
      setSubmitting,
      setErrors,
    }: FormikHelpers<yup.InferType<typeof proposeWasteTypeSchema>>,
  ) => {
    if (!recaptchaToken) return
    setSubmitting(true)

    try {
      const response = await fetch(apiRoute, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, recaptchaToken }),
      })

      if (!response.ok) {
        const data = await response.json()

        showErrorMessages(data.error, setErrors, (message: string) => {
          enqueueSnackbar(message, { variant: 'error' })
        })
        return
      }
      setOpen(false)
      enqueueSnackbar(successMessage, { variant: 'success' })
    } catch (error) {
      enqueueSnackbar(errorMessage, { variant: 'error' })
    } finally {
      recaptchaRef.current?.reset()
      setSubmitting(false)
    }
  }

  return (
    <Container>
      <Typography component="h2" variant="h6" align="center" gutterBottom>
        {headerText}
      </Typography>
      <Typography align="center" sx={{ mb: 1 }} variant="body2">
        {headerDetailsText}
      </Typography>
      <Formik
        enableReinitialize
        initialValues={{
          userName: '',
          email: '',
          wasteTypeToAdd: '',
          additionalNotes: '',
        }}
        validationSchema={proposeWasteTypeSchema}
        onSubmit={formHandler}
      >
        {({ isSubmitting, values, setFieldValue }) => {
          let availableSymbols = limit - values.additionalNotes.length
          availableSymbols = availableSymbols >= 0 ? availableSymbols : 0

          if (values.additionalNotes.length > limit) {
            setFieldValue(
              'message',
              values.additionalNotes.substring(0, limit),
              false,
            )
          }

          return (
            <Form>
              <Box mb={3}>
                <Typography
                  gutterBottom
                  color="textSecondary"
                  sx={{ fontWeight: 'bold' }}
                >
                  Ваше имя
                </Typography>
                <Field
                  component={TextFieldFormik}
                  variant="outlined"
                  fullWidth
                  name="userName"
                />
              </Box>

              <Box mb={3}>
                <Typography
                  gutterBottom
                  color="textSecondary"
                  sx={{ fontWeight: 'bold' }}
                >
                  {emailHeadingText}
                </Typography>
                <Field
                  component={TextFieldFormik}
                  variant="outlined"
                  fullWidth
                  name="email"
                />
              </Box>

              <Box mb={3}>
                <Typography
                  gutterBottom
                  color="textSecondary"
                  sx={{ fontWeight: 'bold' }}
                >
                  {wasteTypeToAddHeadingText}
                </Typography>
                <Field
                  component={TextFieldFormik}
                  variant="outlined"
                  fullWidth
                  name="wasteTypeToAdd"
                />
              </Box>

              <Box mb={3}>
                <Typography
                  gutterBottom
                  color="textSecondary"
                  sx={{ fontWeight: 'bold' }}
                >
                  {addititonalNotesHeadingText}
                </Typography>
                <Field
                  component={TextFieldFormik}
                  multiline
                  rows={5}
                  variant="outlined"
                  fullWidth
                  name="additionalNotes"
                />

                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{ fontWeight: 'fontWeightLight' }}
                >
                  {remainedSymbolsText}: {availableSymbols}
                </Typography>
              </Box>

              <Box mb={3}>
                <ReCAPTCHA
                  ref={recaptchaRef}
                  sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
                  onChange={setRecaptchaToken}
                />
              </Box>

              <Box>
                <Button
                  variant="contained"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {submitButtonText}
                  {isSubmitting && <ButtonSubmittingCircle />}
                </Button>
              </Box>
            </Form>
          )
        }}
      </Formik>
    </Container>
  )
}
