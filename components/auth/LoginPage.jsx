import React, { useState } from 'react'
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
import TextFieldFormik from '../uiParts/formInputs/TextFieldFormik.jsx'
import Link from '../uiParts/Link.jsx'
import Snackbar from '../uiParts/Snackbars.jsx'
import ButtonSubmittingCircle from '../uiParts/ButtonSubmittingCircle.jsx'
import { signIn } from 'next-auth/react'
import { loginSchema } from '../../lib/validation'
import AuthLayout from '../layouts/AuthLayout.jsx'
import showErrorMessages from '../../lib/helpers/showErrorMessages'

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

export default function SignIn() {
  const classes = useStyles()
  const theme = useTheme()
  const [backendError, setBackendError] = useState(null)
  const router = useRouter()

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
