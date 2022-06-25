import React, { useState, useRef } from 'react'
import {
  Typography,
  Button,
  makeStyles,
  useTheme,
  Container,
} from '@material-ui/core'
import { Formik, Form, Field } from 'formik'
import Snackbar from '../uiParts/Snackbars.jsx'
import TextFieldFormik from '../uiParts/formInputs/TextFieldFormik.jsx'
import ButtonSubmittingCircle from '../uiParts/ButtonSubmittingCircle.jsx'
import AuthLayout from '../layouts/AuthLayout.jsx'
import { emailSchema } from '../../lib/validation'
import ReCAPTCHA from 'react-google-recaptcha'
import submitWithCapthca from '../lib/helpers/submitWithCaptcha'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}))

export default function ForgetPasswordPage() {
  const classes = useStyles()
  const theme = useTheme()
  const [notification, setNotification] = useState('')
  const [severity, setSeverity] = useState('error')
  const [recaptcha, setRecaptcha] = useState(null)
  const [showRecaptcha, setShowRecaptcha] = useState(false)
  const recaptchaRef = useRef(null)

  const handleChange = (token) => {
    setRecaptcha(token)
  }

  return (
    <>
      <AuthLayout title="Recycl | Forget password">
        <Container className={classes.root} component="main" maxWidth="xs">
          <Typography
            component="h1"
            variant="h3"
            align="center"
            style={{ marginBottom: `${theme.spacing(6)}px` }}
            color="secondary"
          >
            Забыли пароль?
          </Typography>
          <Typography
            align="center"
            style={{
              marginBottom: `${theme.spacing(2)}px`,
            }}
          >
            Введите ваш email и мы вышлем вам код подтверждения. Вы сможете
            установить новый пароль после перехода по ссылке из полученного
            письма.
          </Typography>
          <Formik
            initialValues={{
              email: '',
            }}
            validationSchema={emailSchema}
            onSubmit={async (
              values,
              { setSubmitting, setErrors, resetForm }
            ) => {
              const options = {
                recaptcha,
                recaptchaRef,
                showRecaptcha,
                values,
                endpointUrl: '/api/forgetpassword',
                setRecaptcha,
                setShowRecaptcha,
                setSubmitting,
                setNotification,
                setErrors,
                setSeverity,
                resetForm,
              }
              await submitWithCapthca(options)
            }}
          >
            {({ isSubmitting }) => {
              return (
                <Form className={classes.form} noValidate autoComplete="off">
                  <Field
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Электронная почта"
                    name="email"
                    component={TextFieldFormik}
                  />
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="secondary"
                    className={classes.submit}
                    disabled={isSubmitting}
                  >
                    Отправить
                    {isSubmitting && <ButtonSubmittingCircle />}
                  </Button>
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
      </AuthLayout>

      <Snackbar
        severity={severity}
        open={!!notification}
        message={notification}
        handleClose={() => setNotification('')}
      />
    </>
  )
}
