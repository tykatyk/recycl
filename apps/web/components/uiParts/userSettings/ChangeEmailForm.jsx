import React, { useState } from 'react'
import { styled } from '@mui/material/styles'
import { Button, Box } from '@mui/material'
import { Formik, Form, Field } from 'formik'
import Snackbar from '../Snackbars'
import TextFieldFormik from '../formInputs/TextFieldFormik'
import ButtonSubmittingCircle from '../ButtonSubmittingCircle'
import { loginSchema as changeEmailSchema } from '../../../lib/validation'

const PREFIX = 'ChangeEmailForm'

const classes = {
  avatar: `${PREFIX}-avatar`,
  box: `${PREFIX}-box`,
  alternativeBox: `${PREFIX}-alternativeBox`,
  form: `${PREFIX}-form`,
  field: `${PREFIX}-field`,
  submit: `${PREFIX}-submit`,
}

const StyledBox = styled(Box)(({ theme }) => ({
  [`& .${classes.avatar}`]: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },

  [`&.${classes.box}`]: {
    width: '100%',
    maxWidth: '400px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },

  [`& .${classes.alternativeBox}`]: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },

  [`& .${classes.form}`]: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },

  [`& .${classes.field}`]: {
    marginBottom: theme.spacing(4),
  },

  [`& .${classes.submit}`]: {
    margin: theme.spacing(3, 0, 2),
  },
}))

export default function ChangeEmailForm() {
  const [severity, setSeverity] = useState('error')
  const [notification, setNotification] = useState('')

  return (
    <StyledBox className={classes.box}>
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
                  setNotification(error.message)
                  return
                }
                setNotification(
                  'Неизвестная ошибка при обработке ответа сервера'
                )
                return
              } else {
                setSeverity('success')
                setNotification(data.message)
              }
            })
            .catch((error) => {
              setSeverity('error')
              setNotification('Неизвестная ошибка')
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
        open={!!notification}
        message={notification}
        handleClose={() => {
          setNotification('')
        }}
      />
    </StyledBox>
  )
}
