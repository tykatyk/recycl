import { useState, useRef } from 'react'
import { Typography, Box, Button, Container } from '@mui/material'
import { proposeWasteTypeSchema } from '../lib/validation'
import TextFieldFormik from './uiParts/formInputs/TextFieldFormik'
import ButtonSubmittingCircle from './uiParts/ButtonSubmittingCircle'
import { Formik, Form, Field, FormikHelpers } from 'formik'
import ReCAPTCHA from 'react-google-recaptcha'
import { useSnackbar } from 'notistack'
import * as yup from 'yup'
import { validateForm } from '../lib/helpers/errorHelpers'
import { useTranslations } from 'use-intl'

const apiRoute = '/api/contact-us/propose-waste-type'

export default function ProposeWasteType({ setOpen }) {
  const limit = 1000
  const [recaptchaToken, setRecaptchaToken] = useState(null)
  const recaptchaRef = useRef<ReCAPTCHA>(null)
  const { enqueueSnackbar } = useSnackbar()
  const t = useTranslations('ProposeWasteType')
  const tValidationMessages = useTranslations('ValidationMessages')

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
        enqueueSnackbar(t('errorMessage'), { variant: 'error' })
        return
      }
      setOpen(false)
      enqueueSnackbar(t('successMessage'), { variant: 'success' })
    } catch (error) {
      enqueueSnackbar(t('errorMessage'), { variant: 'error' })
    } finally {
      recaptchaRef.current?.reset()
      setSubmitting(false)
    }
  }

  return (
    <Container>
      <Typography component="h2" variant="h6" align="center" gutterBottom>
        {t('header')}
      </Typography>
      <Typography align="center" sx={{ mb: 1 }} variant="body2">
        {t('headerDetails')}
      </Typography>
      <Formik
        enableReinitialize
        initialValues={{
          userName: '',
          email: '',
          wasteTypeToAdd: '',
          additionalNotes: '',
        }}
        validate={async (values) => {
          return await validateForm({
            values,
            validationSchema: proposeWasteTypeSchema,
            translations: tValidationMessages,
          })
        }}
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
                  {t('form.yourName')}
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
                  {t('form.yourEmail')}
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
                  {t('form.wasteTypeToAdd')}
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
                  {t('form.additionalNotes')}
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
                  {t('remainedSymbols')}: {availableSymbols}
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
                  {t('form.submit')}
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
