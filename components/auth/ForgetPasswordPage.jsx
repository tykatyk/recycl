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
import showErrorMessages from '../../lib/helpers/showErrorMessages'

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

  const handleExpire = () => {
    setRecaptcha(null)
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
            onSubmit={(values, { setSubmitting, setErrors, resetForm }) => {
              setSubmitting(true)
              if (!showRecaptcha) {
                setShowRecaptcha(true)
                setSubmitting(false)
                return
              }

              if (!recaptcha) {
                setSubmitting(false)
                return
              }

              const merged = { ...values, ...{ recaptcha: recaptcha } }

              fetch('/api/auth/forgetpassword', {
                method: 'POST',
                body: JSON.stringify(merged),
                headers: {
                  'Content-Type': 'application/json',
                },
              })
                .then((response) => {
                  return response.json()
                })
                .then((data) => {
                  if (data.error) {
                    showErrorMessages(data.error, setErrors, setNotification)
                    return
                  }
                  resetForm()
                  setSeverity('success')
                  setNotification(data.message)
                })
                .catch((error) => {
                  setNotification('Неизвестная ошибка')
                })
                .finally(() => {
                  if (recaptchaRef && recaptchaRef.current) {
                    recaptchaRef.current.reset()
                    setShowRecaptcha(false)
                    setRecaptcha(null)
                    setSubmitting(false)
                  }
                })
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
              onExpired={handleExpire}
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
