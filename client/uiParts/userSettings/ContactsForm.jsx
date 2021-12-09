import React, { useState } from 'react'
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

  const [updateContacts, { data, loading }] = useMutation(UPDATE_USER_CONTACTS)

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
          try {
            await updateContacts({ variables: { contacts: values } })
          } catch (error) {
            if (
              error.graphQLErrors &&
              error.graphQLErrors.length > 0 &&
              error.graphQLErrors[0].extensions &&
              error.graphQLErrors[0].extensions.detailedMessages
            ) {
              setErrors(error.graphQLErrors[0].extensions.detailedMessages)
            } else {
              console.log(error)
              setBackendError('Возникла ошибка при сохранении данных')
            }
          } finally {
            setSubmitting(false)
          }
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
        severity="error"
        open={!!backendError}
        message={backendError}
        handleClose={() => {
          setBackendError(null)
        }}
      />
    </Box>
  )
}
