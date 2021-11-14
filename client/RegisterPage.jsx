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
} from '@material-ui/core'
import { Formik, Form, Field } from 'formik'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import TextFieldFormik from './uiParts/formInputs/TextFieldFormik.jsx'
import PageLoadingCircle from './uiParts/PageLoadingCircle.jsx'
import ButtonSubmittingCircle from './uiParts/ButtonSubmittingCircle.jsx'
import Snackbar from './uiParts/Snackbars.jsx'
import Link from './uiParts/Link.jsx'
import Head from './uiParts/Head.jsx'
import Copyright from './uiParts/Copyright.jsx'
import * as yup from 'yup'
import { signIn } from 'next-auth/react'
import { GET_ROLE_ID } from '../lib/graphql/queries/userRole'
import { useQuery } from '@apollo/client'
import { useRouter } from 'next/router'
import { registerSchema } from '../lib/validation/'

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

export default function SignUp() {
  const router = useRouter()
  const classes = useStyles()
  const theme = useTheme()
  const { loading, data, error } = useQuery(GET_ROLE_ID, {
    variables: { roleName: 'user' },
  })
  const [backendError, setBackendError] = useState(null)

  if (loading) return <PageLoadingCircle />

  if (error) {
    return <Typography>Возникла ошибка при получении данных</Typography>
  }

  return (
    <>
      <Head title="Recycl | Register" />
      <Container component="main" maxWidth="xs">
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Регистрация
          </Typography>
          <Formik
            initialValues={{
              role: data.getRoleId,
              username: '',
              email: '',
              password: '',
              confirmPassword: '',
            }}
            validationSchema={registerSchema}
            onSubmit={(values, { setSubmitting, setErrors }) => {
              setSubmitting(true)

              fetch('/api/auth/signup/', {
                method: 'POST',
                body: JSON.stringify(values),
                headers: {
                  'Content-Type': 'application/json',
                },
              })
                .then((response) => {
                  return response.json()
                })
                .then((data) => {
                  if (data.error) {
                    if (data.error.type === 'perField') {
                      setErrors(data.error.message)
                      return
                    }
                    if (data.error.type === 'perForm') {
                      setBackendError(data.error.message)
                      return
                    }

                    setBackendError(
                      'Неизвестная ошибка при обработке ответа сервера'
                    )
                    return
                  }
                  router.push('/')
                })
                .catch((error) => {
                  setBackendError('Ошибка при отпавке запроса на сервер')
                })
                .finally(() => {
                  setSubmitting(false)
                })
            }}
          >
            {({ isSubmitting, errors }) => {
              return (
                <Form className={classes.form} noValidate autoComplete="off">
                  <Field type="hidden" name="role" />
                  <Field
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="username"
                    label="Имя или название организации"
                    name="username"
                    component={TextFieldFormik}
                  />
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
                  <Field
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    name="confirmPassword"
                    label="Пароль повторно"
                    type="password"
                    id="confirmPassword"
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
                    Зарегистрироваться
                    {isSubmitting && <ButtonSubmittingCircle />}
                  </Button>
                  <Grid container style={{ justifyContent: 'flex-end' }}>
                    <Grid item>
                      <Link
                        href="/login"
                        variant="body2"
                        style={{ color: `${theme.palette.text.secondary}` }}
                      >
                        {'Уже есть аккаунт?'}
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
