import React, { useState, useEffect, useRef } from 'react'
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

const useStyles = makeStyles((theme) => ({
  paper: {
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
  const [backendError, setBackendError] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const [severity, setSeverity] = useState('error')
  const [recaptcha, setRecaptcha] = useState(null)
  const recaptchaRef = useRef(null)

  const handleChange = (token) => {
    setRecaptcha(token)
  }

  const handleExpire = () => {
    setRecaptcha(null)
  }

  useEffect(() => {
    if (backendError) {
      setSeverity('error')
      setBackendError(backendError)
    } else if (successMessage) {
      setSeverity('success')
      setSuccessMessage(successMessage)
    }
  }, [backendError, successMessage])

  return (
    <>
      <AuthLayout title="Recycl | Forget password">
        <Container component="main" maxWidth="xs">
          <div className={classes.paper}>
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
              onSubmit={(values, { setSubmitting, setErrors }) => {
                setSubmitting(true)

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
                      const error = data.error
                      if (error.type === 'perField') {
                        setErrors(error.message)
                        return
                      }
                      if (error.type === 'perForm') {
                        setBackendError(error.message)
                        return
                      }
                      setBackendError(
                        'Неизвестная ошибка при обработке ответа сервера'
                      )
                      return
                    } else {
                      setSeverity('success')
                      setSuccessMessage(data.message)
                    }
                  })
                  .catch((error) => {
                    console.log(error)
                    setBackendError('Неизвестная ошибка')
                  })
                  .finally(() => {
                    if (recaptchaRef && recaptchaRef.current) {
                      recaptchaRef.current.reset()
                    }
                    setRecaptcha(null)
                    setSubmitting(false)
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
                    <div
                      style={{
                        display: 'flex',
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
                  </Form>
                )
              }}
            </Formik>
          </div>
        </Container>
      </AuthLayout>

      <Snackbar
        severity={severity}
        open={!!backendError || !!successMessage}
        message={backendError || successMessage}
        handleClose={() => {
          setBackendError(null)
          setSuccessMessage(null)
        }}
      />
    </>
  )
}
