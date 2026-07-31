import { useState, useRef } from 'react'
import { Typography, Box, Button, Container } from '@mui/material'
import Layout from './layouts/Layout'
import { contactUsSchema } from '../lib/validation'
import TextFieldFormik from './uiParts/formInputs/TextFieldFormik'
import ButtonSubmittingCircle from './uiParts/ButtonSubmittingCircle'
import { Formik, Form, Field } from 'formik'
import ReCAPTCHA from 'react-google-recaptcha'
import { useSnackbar } from 'notistack'
import { showErrorMessages } from '../lib/helpers/errorHelpers'

const apiRoute = 'api/contact-us/general'
const successMessage = 'Сообщение успешно отправлено'
const errorMessage = 'Ошибка при отправкве формы'
const limit = 1000

export default function SupportUsPage() {
  const [recaptchaToken, setRecaptchaToken] = useState(null)
  const recaptchaRef = useRef<ReCAPTCHA>(null)

  const { enqueueSnackbar } = useSnackbar()

  const handleChange = (token) => {
    setRecaptchaToken(token)
  }

  return (
    <Layout title={`Связаться с нами | ${process.env.NEXT_PUBLIC_BRAND}`}>
      <Container maxWidth="md">
        <Typography component="h1" variant="h6" align="center" gutterBottom>
          Если у вас есть вопросы, предложения или замечания относительно работы
          сайта, заполните, пожалуйста, приведенную ниже форму и мы свяжемся с
          вами в ближайшее время
        </Typography>
        <Formik
          enableReinitialize
          initialValues={{
            subject: '',
            userName: '',
            email: '',
            message: '',
          }}
          validationSchema={contactUsSchema}
          onSubmit={async (values, { setSubmitting, setErrors, resetForm }) => {
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
              enqueueSnackbar(successMessage, { variant: 'success' })
              resetForm()
            } catch (error) {
              enqueueSnackbar(errorMessage, { variant: 'error' })
            } finally {
              recaptchaRef.current?.reset()
              setSubmitting(false)
            }
          }}
        >
          {({ isSubmitting, values, setFieldValue }) => {
            let availableSymbols = limit - values.message.length
            availableSymbols = availableSymbols >= 0 ? availableSymbols : 0

            if (values.message.length > limit) {
              setFieldValue(
                'message',
                values.message.substring(0, limit),
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
                    Тема письма
                  </Typography>
                  <Field
                    component={TextFieldFormik}
                    variant="outlined"
                    fullWidth
                    name="subject"
                  />
                </Box>
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
                    Email для обратной связи
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
                    Текст сообщения
                  </Typography>
                  <Field
                    component={TextFieldFormik}
                    multiline
                    rows={5}
                    variant="outlined"
                    fullWidth
                    name="message"
                  />

                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{ fontWeight: 'fontWeightLight' }}
                  >
                    Осталось: {availableSymbols}
                  </Typography>
                </Box>
                <Box mb={3}>
                  <ReCAPTCHA
                    ref={recaptchaRef}
                    sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
                    onChange={handleChange}
                  />
                </Box>
                <Box mb={3}>
                  <Button
                    variant="contained"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    Отправить
                    {isSubmitting && <ButtonSubmittingCircle />}
                  </Button>
                </Box>
              </Form>
            )
          }}
        </Formik>
      </Container>
    </Layout>
  )
}
