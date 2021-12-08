import React, { useState, useEffect } from 'react'
import { Button, Box, makeStyles, useTheme } from '@material-ui/core'
import { Formik, Form, Field } from 'formik'
import Snackbar from '../Snackbars.jsx'
import PlacesAutocomplete from '../formInputs/PlacesAutocomplete.jsx'
import TextFieldFormik from '../formInputs/TextFieldFormik.jsx'
import ButtonSubmittingCircle from '../ButtonSubmittingCircle.jsx'
import { contactsSchema } from '../../../lib/validation'
import { UPDATE_USER_CONTACTS } from '../../../lib/graphql/queries/user'
import { useMutation } from '@apollo/client'

const useStyles = makeStyles((theme) => ({
  box: {
    width: '100%',
    maxWidth: '400px',
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

  const [updateContacts, { data, loading, error }] =
    useMutation(UPDATE_USER_CONTACTS)

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
        <Formik
          initialValues={{
            username: '',
            location: '',
          }}
          validationSchema={contactsSchema}
        onSubmit={async (values, { setSubmitting, setErrors }) => {
            setSubmitting(true)
          const location = {
            description: values.location.description,
            place_id: values.location.place_id,
                }
          values.location = location

          await updateContacts({ variables: { contacts: values } })
                setSubmitting(false)
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
