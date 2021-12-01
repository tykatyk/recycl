import React, { useState, useEffect } from 'react'
import {
  Typography,
  Box,
  Button,
  makeStyles,
  useTheme,
  Container,
} from '@material-ui/core'
import { Formik, Form, Field } from 'formik'
import Head from './uiParts/Head.jsx'
import Snackbar from './uiParts/Snackbars.jsx'
import Copyright from './uiParts/Copyright.jsx'
import TextFieldFormik from './uiParts/formInputs/TextFieldFormik.jsx'
import ButtonSubmittingCircle from './uiParts/ButtonSubmittingCircle.jsx'
import { emailSchema } from '../lib/validation/'

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

export default function ForgetPassword() {
  const classes = useStyles()
  const theme = useTheme()
  const [backendError, setBackendError] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const [severity, setSeverity] = useState('error')
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
      <Head title="Recycl | Forget password" />
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
              fetch('/api/auth/forgetpassword', {
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
                    setSuccessMessage(data.message)
                  }
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
          <Box mt={8} mb={4}>
            <Copyright />
          </Box>
        </div>
      </Container>
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
