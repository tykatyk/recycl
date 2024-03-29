import React, { useState, useRef } from 'react'
import { styled, useTheme } from '@mui/material/styles'
import { useRouter } from 'next/router'
import { Avatar, Button, Grid, Typography, Container } from '@mui/material'
import { Formik, Form, Field } from 'formik'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import TextFieldFormik from '../uiParts/formInputs/TextFieldFormik'
import Link from '../uiParts/Link'
import Snackbar from '../uiParts/Snackbars'
import ButtonSubmittingCircle from '../uiParts/ButtonSubmittingCircle'
import { signIn } from 'next-auth/react'
import { loginSchema } from '../../lib/validation'
import showErrorMessages from '../../lib/helpers/showErrorMessages'
import AuthLayout from '../layouts/AuthLayout'
import ReCAPTCHA from 'react-google-recaptcha'

const PREFIX = 'LoginPage'

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
  const [backendError, setBackendError] = useState(null)
  const router = useRouter()
  const [recaptcha, setRecaptcha] = useState(null)
  const [showRecaptcha, setShowRecaptcha] = useState(false)
  const recaptchaRef = useRef(null)

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
                password: '',
              }}
              validationSchema={loginSchema}
              onSubmit={(values, { setSubmitting, setErrors }) => {
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

                signIn('credentials', {
                  email: values.email,
                  password: values.password,
                  redirect: false,
                })
                  .then((data) => {
                    if (data.error) {
                      setSubmitting(false)
                      showErrorMessages(
                        JSON.parse(data.error),
                        setErrors,
                        setBackendError
                      )
                      return
                    }

                    if (router.query && router.query.from) {
                      router.push(router.query.from)
                    } else {
                      router.push('/')
                    }
                  })
                  .catch((error) => {
                    setBackendError('Неизвестная ошибка')
                    setSubmitting(false)
                  })
                  .finally(() => {
                    if (recaptchaRef && recaptchaRef.current) {
                      recaptchaRef.current.reset()
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
                    <Field
                      variant="outlined"
                      margin="normal"
                      required
                      fullWidth
                      name="password"
                      label="Пароль"
                      type="password"
                      id="password"
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
                      Войти
                      {isSubmitting && <ButtonSubmittingCircle />}
                    </Button>
                  </Form>
                )
              }}
            </Formik>
            <Formik
              initialValues={{
                callbackUrl: `${process.env.NEXTAUTH_URL}/api/auth/callback/google`,
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
                      Войти с аккаунтом Google
                      {isSubmitting && <ButtonSubmittingCircle />}
                    </Button>
                  </Form>
                )
              }}
            </Formik>

            <Grid container style={{ marginBottom: theme.spacing(4) }}>
              <Grid item xs>
                <Link
                  href="/auth/forgetpassword"
                  variant="body2"
                  style={{ color: `${theme.palette.text.secondary}` }}
                >
                  Забыли пароль?
                </Link>
              </Grid>
              <Grid item>
                <Link
                  href="/auth/register"
                  variant="body2"
                  style={{ color: `${theme.palette.text.secondary}` }}
                >
                  Нет аккаунта?
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
                ref={recaptchaRef}
                sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
                onChange={handleChange}
              />
            </div>
          </div>
        </Container>
      </AuthLayout>
      <Snackbar
        severity="error"
        open={!!backendError}
        message={backendError}
        handleClose={() => {
          setBackendError(null)
        }}
      />
    </Root>
  )
}
