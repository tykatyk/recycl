import React, { useState } from 'react'
import {
  Avatar,
  Button,
  Typography,
  makeStyles,
  Container,
} from '@material-ui/core'
import { Formik, Form, Field } from 'formik'
import RotateLeftSharpIcon from '@material-ui/icons/RotateLeftSharp'
import TextFieldFormik from '../uiParts/formInputs/TextFieldFormik'
import Snackbar from '../uiParts/Snackbars'
import ButtonSubmittingCircle from '../uiParts/ButtonSubmittingCircle'
import { passwordSchema } from '../../lib/validation'
import AuthLayout from '../layouts/AuthLayout'
import showErrorMessages from '../../lib/helpers/showErrorMessages'

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

export default function ResetPasswordForm({ token }) {
  const classes = useStyles()
  const [notification, setNotification] = useState('')
  const [severity, setSeverity] = useState('error')

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
                      showErrorMessages(data.error, setErrors, setNotification)
                      return
                    }
                    setSeverity('success')
                    setNotification('Пароль успешно изменен')
                  })
                  .catch((error) => {
                    setNotification('Неизвестная ошибка')
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
          open={!!notification}
          message={notification}
          handleClose={() => {
            setNotification('')
          }}
        />
      </AuthLayout>
    </>
  )
}
