import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import {
  Avatar,
  Button,
  Box,
  Typography,
  makeStyles,
  useTheme,
} from '@material-ui/core'
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline'
import { Formik, Form, Field } from 'formik'
import Snackbar from '../Snackbars.jsx'
import PlacesAutocomplete from '../formInputs/PlacesAutocomplete.jsx'
import TextFieldFormik from '../formInputs/TextFieldFormik.jsx'
import ButtonSubmittingCircle from '../ButtonSubmittingCircle.jsx'
import PageLoadingCircle from '../PageLoadingCircle.jsx'
import { contactsSchema } from '../../../lib/validation'
import {
  GET_USER_CONTACTS,
  UPDATE_USER_CONTACTS,
} from '../../../lib/graphql/queries/user'
import { useMutation, useQuery } from '@apollo/client'

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

export default function ContactsForm() {
  const classes = useStyles()
  const theme = useTheme()
  const { data: session } = useSession()
  const [id, setId] = useState('')
  const [severity, setSeverity] = useState('error')
  const [notification, setNotification] = useState('')

  const [updateContacts, { data: updateData }] =
    useMutation(UPDATE_USER_CONTACTS)
  const { data, error, loading } = useQuery(GET_USER_CONTACTS, {
    variables: { id }, //ToDo: should be refactored since user is available in appolo context
  })

  useEffect(() => {
    if (updateData && updateData.updateUserContacts) {
      setSeverity('success')
      setNotification('Данные успешно обновлены')
    }
  }, [updateData])

  useEffect(() => {
    if (session) setId(session.id)
  }, [session])

  if (loading)
    return (
      <Box className={classes.alternativeBox}>
        <PageLoadingCircle style={{ position: 'static' }} />
      </Box>
    )

  if (error) {
    return (
      <Box className={classes.alternativeBox}>
        <Avatar className={classes.avatar}>
          <ErrorOutlineIcon />
        </Avatar>
        <Typography variant="body2">Ошибка при получении данных</Typography>
      </Box>
    )
  }

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

          if (values.location) {
            const locationToSave = {
              description: values.location.description,
              place_id: values.location.place_id,
            }
            values.location = locationToSave
          }
          try {
            await updateContacts({ variables: { contacts: values } })
          } catch (error) {
            if (
              error.graphQLErrors &&
              error.graphQLErrors.length > 0 &&
              error.graphQLErrors[0].extensions.detailedMessages
            ) {
              setErrors(error.graphQLErrors[0].extensions.detailedMessages)
            } else {
              setSeverity('error')
              setNotification('Возникла ошибка при сохранении данных')
            }
          } finally {
            setSubmitting(false)
          }
        }}
      >
        {({ isSubmitting, setFieldValue }) => {
          useEffect(() => {
            if (!data || !data.getUserContacts) return

            setFieldValue('username', data.getUserContacts.name, false)

            const locationToShow = data.getUserContacts.location
              ? data.getUserContacts.location
              : null

            setFieldValue('location', locationToShow, false)
          }, [data])

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
        severity={severity}
        open={!!notification}
        message={notification}
        handleClose={() => {
          setNotification('')
        }}
      />
    </Box>
  )
}
