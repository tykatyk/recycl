import { useState, useRef } from 'react'
import { useTheme } from '@mui/material/styles'
import { Typography, Box, Button, Container } from '@mui/material'
import Layout from './layouts/Layout'
import { contactUsSchema } from '../lib/validation'
import { whitespaceRegex } from '@recycl/shared/dist/validation/regularExpressions'
import submitWithCapthca from '../lib/helpers/submitWithCaptcha'
import TextFieldFormik from './uiParts/formInputs/TextFieldFormik'
import Snackbars from './uiParts/Snackbars'
import ButtonSubmittingCircle from './uiParts/ButtonSubmittingCircle'
import { Formik, Form, Field } from 'formik'
import ReCAPTCHA from 'react-google-recaptcha'

export default function SupportUsPage() {
  const limit = 1000
  const theme = useTheme()
  const [notification, setNotification] = useState('')
  const [severity, setSeverity] = useState('')
  const [recaptcha, setRecaptcha] = useState(null)
  const [showRecaptcha, setShowRecaptcha] = useState(false)
  const recaptchaRef = useRef(null)

  const handleChange = (token) => {
    setRecaptcha(token)
  }

  return (
    <Layout title="Связаться с нами | Recycl">
      <Container>
        {!!notification && (
          <Snackbars
            open={!!notification}
            handleClose={() => {
              setNotification('')
            }}
            message={notification}
            severity={severity}
          />
        )}

        <Typography component="h1" variant="h6" align="center" gutterBottom>
          Если у вас есть вопросы, предложения или замечания относительно работы
          сайта, заполните, пожалуйста, приведенную ниже форму и мы свяжемся с
          вами в ближайшее время
        </Typography>
        <Formik
          enableReinitialize
          initialValues={{
            subject: '',
            username: '',
            email: '',
            message: '',
          }}
          validationSchema={contactUsSchema}
          onSubmit={(values, { setSubmitting, setErrors, resetForm }) => {
            const options = {
              recaptcha,
              recaptchaRef,
              showRecaptcha,
              values,
              endpointUrl: '/api/contact-us',
              setRecaptcha,
              setShowRecaptcha,
              setSubmitting,
              setNotification,
              setErrors,
              setSeverity,
              resetForm,
            }
            submitWithCapthca(options)
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
                    name="username"
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
                <Box>
                  <Button
                    variant="contained"
                    type="submit"
                    disabled={
                      values.message.replace(whitespaceRegex, '') === '' ||
                      isSubmitting
                    }
                  >
                    Отправить
                    {isSubmitting && <ButtonSubmittingCircle />}
                  </Button>
                </Box>
              </Form>
            )
          }}
        </Formik>
        <div
          style={{
            display: showRecaptcha ? 'flex' : 'none',
            justifyContent: 'center',
            margin: theme.spacing(2, 0),
          }}
        >
          <ReCAPTCHA
            ref={recaptchaRef}
            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
            onChange={handleChange}
          />
        </div>
      </Container>
    </Layout>
  )
}
