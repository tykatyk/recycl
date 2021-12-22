import React, { useState } from 'react'
import { Button, Box, makeStyles } from '@material-ui/core'
import { Formik, Form, Field } from 'formik'
import Snackbar from '../Snackbars.jsx'
import TextFieldFormik from '../formInputs/TextFieldFormik.jsx'
import ButtonSubmittingCircle from '../ButtonSubmittingCircle.jsx'
import { loginSchema as changeEmailSchema } from '../../../lib/validation'

const useStyles = makeStyles((theme) => ({
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },

  box: {
    width: '100%',
    maxWidth: '400px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  alternativeBox: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  field: {
    marginBottom: theme.spacing(4),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}))

export default function ChangeEmailForm() {
  const classes = useStyles()
  const [severity, setSeverity] = useState('error')
  const [successMessage, setSuccessMessage] = useState(null)
  const [backendError, setBackendError] = useState(null)

  return (
    <Box className={classes.box}>
      <Formik
        initialValues={{
          email: '',
          password: '',
        }}
        validationSchema={changeEmailSchema}
        onSubmit={async (values, { setSubmitting, setErrors }) => {
          setSubmitting(true)

          await fetch('/api/myaccount/settings/changeemail', {
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
                setSeverity('error')
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
              setSeverity('error')
              setBackendError('Неизвестная ошибка')
            })
          setSubmitting(false)
        }}
      >
        {({ isSubmitting }) => {
          return (
            <Form className={classes.form} noValidate autoComplete="off">
              <Field
                variant="outlined"
                margin="normal"
                fullWidth
                id="email"
                label="Новый email адрес"
                name="email"
                component={TextFieldFormik}
                className={classes.field}
              />
              <Field
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="password"
                label="Текущий пароль"
                name="password"
                type="password"
                component={TextFieldFormik}
                className={classes.field}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="secondary"
                className={classes.submit}
                disabled={isSubmitting}
                style={{ width: 'auto' }}
              >
                Сохранить
                {isSubmitting && <ButtonSubmittingCircle />}
              </Button>
            </Form>
          )
        }}
      </Formik>

      <Snackbar
        severity={severity}
        open={!!backendError || !!successMessage}
        message={backendError || successMessage}
        handleClose={() => {
          setBackendError(null)
          setSuccessMessage(null)
        }}
      />
    </Box>
  )
}
