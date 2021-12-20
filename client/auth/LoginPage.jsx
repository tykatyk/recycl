import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import {
  Avatar,
  Button,
  Grid,
  Typography,
  makeStyles,
  useTheme,
  Container,
} from '@material-ui/core'
import { Formik, Form, Field } from 'formik'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import GoogleIcon from '@mui/icons-material/Google'
import TextFieldFormik from '../uiParts/formInputs/TextFieldFormik.jsx'
import Link from '../uiParts/Link.jsx'
import Snackbar from '../uiParts/Snackbars.jsx'
import PageLoadingCircle from '../uiParts/PageLoadingCircle.jsx'
import ButtonSubmittingCircle from '../uiParts/ButtonSubmittingCircle.jsx'
import { signIn, getSession } from 'next-auth/react'
import { loginSchema } from '../../lib/validation'
import AuthLayout from '../layouts/AuthLayout.jsx'

const useStyles = makeStyles((theme) => ({
  paper: {
    // marginTop: theme.spacing(8),
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

export default function SignIn() {
  const classes = useStyles()
  const theme = useTheme()
  const [backendError, setBackendError] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    getSession().then((session) => {
      if (session) {
        router.replace('/')
      } else {
        setLoading(false)
      }
    })
  }, [])

  if (loading) return <PageLoadingCircle />

  return (
    <>
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

                signIn('credentials', {
                  email: values.email,
                  password: values.password,
                  redirect: false,
                })
                  .then((response) => {
                    if (response.error) {
                      try {
                        let error = JSON.parse(response.error)
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
                      } catch (error) {
                        setBackendError(
                          'Неизвестная ошибка при обработке ответа сервера'
                        )
                        return
                      }
                    }

                    if (router.query && router.query.from) {
                      router.push(router.query.from)
                      return
                    }

                    router.push('/')
                  })
                  .catch((error) => {
                    setBackendError('Неизвестная ошибка')
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
              onSubmit={async ({ setSubmitting }) => {
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
                      startIcon={<GoogleIcon />}
                    >
                      Войти с аккаунтом Google
                      {isSubmitting && <ButtonSubmittingCircle />}
                    </Button>
                  </Form>
                )
              }}
            </Formik>
            <Grid container>
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
    </>
  )
}
