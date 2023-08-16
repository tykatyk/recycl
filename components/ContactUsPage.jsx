import React, { useState, useRef } from 'react'
import {
  makeStyles,
  Typography,
  Box,
  Button,
  Container,
  useTheme,
} from '@material-ui/core'
import Layout from './layouts/Layout'
import { contactUsSchema } from '../lib/validation'
import whitespaceRegex from '../lib/validation/regularExpressions'
import submitWithCapthca from '../lib/helpers/submitWithCaptcha'
import TextFieldFormik from './uiParts/formInputs/TextFieldFormik'
import Snackbars from './uiParts/Snackbars'
import ButtonSubmittingCircle from './uiParts/ButtonSubmittingCircle'
import { Formik, Form, Field } from 'formik'
import ReCAPTCHA from 'react-google-recaptcha'

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    maxWidth: 800,
  },
  header: {
    marginBottom: theme.spacing(5),
  },
  form: {
    '& > fieldset': {
      margin: 0,
      marginBottom: theme.spacing(5),
      padding: 0,
      border: 'none',
    },
  },
  remainedSymbols: {
    color: theme.palette.text.secondary,
  },
}))

export default function SupportUsPage() {
  const classes = useStyles()
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
      <Container className={classes.container}>
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

        <Typography variant="h6" className={classes.header} align="center">
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
                false
              )
            }

            return (
              <Form className={classes.form}>
                <Box mb={3}>
                  <Typography gutterBottom>Тема письма</Typography>
                  <Field
                    component={TextFieldFormik}
                    variant="outlined"
                    fullWidth
                    name="subject"
                  />
                </Box>
                <Box mb={3}>
                  <Typography gutterBottom>Ваше имя</Typography>
                  <Field
                    component={TextFieldFormik}
                    variant="outlined"
                    fullWidth
                    name="username"
                  />
                </Box>

                <Box mb={3}>
                  <Typography gutterBottom>Email для обратной связи</Typography>
                  <Field
                    component={TextFieldFormik}
                    variant="outlined"
                    fullWidth
                    name="email"
                  />
                </Box>

                <Box mb={3}>
                  <Typography gutterBottom>Текст сообщения</Typography>
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
                    className={classes.remainedSymbols}
                  >
                    Осталось: {availableSymbols}
                  </Typography>
                </Box>
                <Box>
                  <Button
                    variant="contained"
                    color="secondary"
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
