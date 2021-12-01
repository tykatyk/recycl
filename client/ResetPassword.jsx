import React, { useState, useEffect } from 'react'
import {
  Avatar,
  Button,
  Typography,
  makeStyles,
  Container,
} from '@material-ui/core'
import { Formik, Form, Field } from 'formik'
import RotateLeftSharpIcon from '@material-ui/icons/RotateLeftSharp'
import TextFieldFormik from './uiParts/formInputs/TextFieldFormik.jsx'
import Snackbar from './uiParts/Snackbars.jsx'
import ButtonSubmittingCircle from './uiParts/ButtonSubmittingCircle.jsx'
import { passwordSchema } from '../lib/validation'
import AuthLayout from './layouts/AuthLayout.jsx'

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

export default function ResetPassword({ token }) {
  const classes = useStyles()
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
      <AuthLayout title="Recycl | Reset password">
        <Container component="main" maxWidth="xs">
          <div className={classes.paper}>
            <Avatar className={classes.avatar}>
              <RotateLeftSharpIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Восстановление пароля
            </Typography>
            <Formik
              initialValues={{
                password: '',
                confirmPassword: '',
              }}
              validationSchema={passwordSchema}
              onSubmit={(values, { setSubmitting, setErrors }) => {
                setSubmitting(true)
                console.log(
                  JSON.stringify({ password: values.password, token })
                )
                fetch('/api/auth/restorepassword/', {
                  method: 'POST',
                  body: JSON.stringify({
                    password: values.password,
                    token,
                  }),
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
                    } else {
                      setSuccessMessage('Пароль успешно изменен')
                    }
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
                      name="password"
                      id="password"
                      label="Новый пароль"
                      type="password"
                      component={TextFieldFormik}
                    />
                    <Field
                      variant="outlined"
                      margin="normal"
                      required
                      fullWidth
                      name="confirmPassword"
                      id="confirmPassword"
                      label="Повторите пароль"
                      type="password"
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
      </AuthLayout>
    </>
  )
}
