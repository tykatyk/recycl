import React, { useState } from 'react'
import {
  Avatar,
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
  Grid,
  Box,
  Typography,
  makeStyles,
  useTheme,
  Container,
  CircularProgress,
} from '@material-ui/core'
import { Formik, Form, Field } from 'formik'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import TextFieldFormik from './uiParts/formInputs/TextFieldFormik.jsx'
import Link from './uiParts/Link.jsx'
import Head from './uiParts/Head.jsx'
import Snackbar from './uiParts/Snackbars.jsx'
import { signIn } from 'next-auth/react'
import * as yup from 'yup'
import { loginSchema } from '../lib/validation/'

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href={`${process.env.NEXT_PUBLIC_URL}`}>
        Recycl
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  )
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
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

const required = '*Обязательное поле'

export default function SignIn() {
  const classes = useStyles()
  const theme = useTheme()
  const [backendError, setBackendError] = useState(null)

  return (
    <>
      <Head title="Recycl | Login" />
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
            onSubmit={(values, { setSubmitting, setErrors }) => {
              setSubmitting(true)

              signIn('credentials', {
                email: values.email,
                password: values.password,
                redirect: false,
              })
                .then((response) => {
                  console.log('response')
                  console.log(response)
                  console.log(JSON.parse(response.error))
                  if (response && response.error) {
                    let error = JSON.parse(response.error)

                    if (error && error.type === 'perField') {
                      setErrors(error.message)
                      return
                    }
                    if (error && error.type === 'perForm') {
                      setBackendError(error.message)
                      return
                    }
                  }
                  return response
                })
                .catch((error) => {
                  console.log(error)
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
                  <FormControlLabel
                    control={<Checkbox value="remember" color="secondary" />}
                    label="Запомнить меня"
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
                    {isSubmitting && (
                      <CircularProgress
                        size={24}
                        style={{
                          color: theme.palette.secondary.main,
                          marginLeft: '1em',
                        }}
                      />
                    )}
                  </Button>
                  <Grid container>
                    <Grid item xs>
                      <Link
                        href="#"
                        variant="body2"
                        style={{ color: `${theme.palette.text.secondary}` }}
                      >
                        Забыли пароль?
                      </Link>
                    </Grid>
                    <Grid item>
                      <Link
                        href="/register"
                        variant="body2"
                        style={{ color: `${theme.palette.text.secondary}` }}
                      >
                        {'Нет аккаунта? Зарегистрируйтесь'}
                      </Link>
                    </Grid>
                  </Grid>
                </Form>
              )
            }}
          </Formik>
        </div>
        <Box mt={8}>
          <Copyright />
        </Box>
      </Container>
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
