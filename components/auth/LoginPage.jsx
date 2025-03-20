import React, { useState } from 'react'
import { styled, useTheme } from '@mui/material/styles'
import { Avatar, Button, Grid, Typography, Container } from '@mui/material'
import { Formik, Form, Field } from 'formik'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import TextFieldFormik from '../uiParts/formInputs/TextFieldFormik'
import Link from '../uiParts/Link'
import Snackbar from '../uiParts/Snackbars'
import ButtonSubmittingCircle from '../uiParts/ButtonSubmittingCircle'
import { signIn } from 'next-auth/react'
import { loginSchema } from '../../lib/validation'
import { showErrorMessages } from '../../lib/helpers/errorHelpers'
import AuthLayout from '../layouts/AuthLayout'
import ReCAPTCHA from 'react-google-recaptcha'

const USER_NOT_FOUND = 'Пользователь с таким email не найден'
const LINK_SENT = 'На вашу электронную почту отправлена ссылка для входа'
const LOGIN_WITH_GOOGLE = 'Войти с аккаунтом Google'
const EMAIL_LABEL = 'Электронная почта'
const SIGN_IN = 'Войти'
const SIGN_UP = 'Регистрация'
const PREFIX = 'LoginPage'
const REGISTER_URL = '/auth/register'
const CALLBACK_URL = `${process.env.NEXTAUTH_URL}/api/auth/callback/google`

const classes = {
  paper: `${PREFIX}-paper`,
  avatar: `${PREFIX}-avatar`,
  form: `${PREFIX}-form`,
  submit: `${PREFIX}-submit`,
}

// TODO jss-to-styled codemod: The Fragment root was replaced by div. Change the tag if needed.
const Root = styled('div')(({ theme }) => ({
  [`& .${classes.paper}`]: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },

  [`& .${classes.avatar}`]: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },

  [`& .${classes.form}`]: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },

  [`& .${classes.submit}`]: {
    margin: theme.spacing(3, 0, 2),
  },
}))

export default function SignIn() {
  const theme = useTheme()
  const [notificatioin, setNotification] = useState('')
  const [notificatioinType, setNotificationType] = useState('success')
  const [recaptcha, setRecaptcha] = useState(null)
  const [showRecaptcha, setShowRecaptcha] = useState(false)

  const handleChange = (token) => {
    setRecaptcha(token)
  }

  return (
    <Root>
      <AuthLayout title="Recycl | Вход">
        <Container component="main" maxWidth="xs">
          <div className={classes.paper}>
            <Avatar className={classes.avatar}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Вход
            </Typography>
            <Formik
              initialValues={{
                email: '',
              }}
              validationSchema={loginSchema}
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

                signIn('email', {
                  email: values.email,
                  redirect: false,
                })
                  .then((data) => {
                    if (data.error) {
                      setSubmitting(false)
                      setNotificationType('error')

                      let modifiedError = data.error

                      if (data.error === 'AccessDenied') {
                        modifiedError = {
                          type: 'perForm',
                          message: USER_NOT_FOUND,
                        }
                      }
                      showErrorMessages(
                        modifiedError,
                        setErrors,
                        setNotification,
                      )
                      return
                    }
                    setNotificationType('success')
                    setNotification(LINK_SENT)
                    resetForm()
                  })
                  .finally(() => {
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
                      label={EMAIL_LABEL}
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
                      {SIGN_IN}
                      {isSubmitting && <ButtonSubmittingCircle />}
                    </Button>
                  </Form>
                )
              }}
            </Formik>
            <Formik
              initialValues={{
                callbackUrl: CALLBACK_URL,
              }}
              onSubmit={async (values, { setSubmitting }) => {
                setSubmitting(true)
                await signIn('google')
                setSubmitting(false)
              }}
            >
              {({ isSubmitting }) => {
                return (
                  <Form className={classes.form} noValidate autoComplete="off">
                    <Field
                      name="callbackUrl"
                      type="hidden"
                      component={TextFieldFormik}
                    />
                    <Button
                      style={{ marginTop: 0 }}
                      type="submit"
                      fullWidth
                      variant="contained"
                      color="secondary"
                      className={classes.submit}
                      disabled={isSubmitting}
                    >
                      {LOGIN_WITH_GOOGLE}
                      {isSubmitting && <ButtonSubmittingCircle />}
                    </Button>
                  </Form>
                )
              }}
            </Formik>

            <Grid
              container
              style={{
                marginBottom: theme.spacing(4),
                justifyContent: 'flex-end',
              }}
            >
              <Grid item>
                <Link
                  href={REGISTER_URL}
                  variant="body2"
                  style={{ color: `${theme.palette.text.secondary}` }}
                >
                  {SIGN_UP}
                </Link>
              </Grid>
            </Grid>
            <div
              style={{
                display: showRecaptcha ? 'flex' : 'none',
                justifyContent: 'center',
                marginBottom: theme.spacing(4),
              }}
            >
              <ReCAPTCHA
                sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
                onChange={handleChange}
              />
            </div>
          </div>
        </Container>
      </AuthLayout>
      <Snackbar
        severity={notificatioinType}
        open={!!notificatioin}
        message={notificatioin}
        handleClose={() => {
          setNotification('')
        }}
      />
    </Root>
  )
}
