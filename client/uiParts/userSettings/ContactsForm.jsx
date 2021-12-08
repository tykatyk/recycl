import React, { useState, useEffect } from 'react'
import { Button, Box, makeStyles, useTheme } from '@material-ui/core'
import { Formik, Form, Field } from 'formik'
import Snackbar from '../Snackbars.jsx'
import PlacesAutocomplete from '../formInputs/PlacesAutocomplete.jsx'
import TextFieldFormik from '../formInputs/TextFieldFormik.jsx'
import ButtonSubmittingCircle from '../ButtonSubmittingCircle.jsx'
import { contactsSchema } from '../../../lib/validation'

const useStyles = makeStyles((theme) => ({
  box: {
    width: '100%',
    maxWidth: '400px',
    display: 'flex',
    flexDirection: 'column',
  },
  paper: {
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

export default function ContactsForm() {
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
    <Box className={classes.box}>
      <div className={classes.paper}>
        <Formik
          initialValues={{
            username: '',
            location: '',
          }}
          validationSchema={contactsSchema}
          onSubmit={(values, { setSubmitting, setErrors }) => {
            setSubmitting(true)
            fetch('/api/myaccount/settings', {
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
                  id="username"
                  label="Имя или название организации"
                  name="username"
                  component={TextFieldFormik}
                  className={classes.field}
                />
                <Field
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="location"
                  label="Город"
                  name="location"
                  component={PlacesAutocomplete}
                  className={classes.field}
                  backgroundColor={theme.palette.grey['800']}
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
      </div>

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
