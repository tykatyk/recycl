import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Avatar, Button, Box, Typography, makeStyles } from '@material-ui/core'
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline'
import { Formik, Form, Field } from 'formik'
import Snackbar from '../Snackbars.jsx'
import TextFieldFormik from '../formInputs/TextFieldFormik.jsx'
import ButtonSubmittingCircle from '../ButtonSubmittingCircle.jsx'
import PageLoadingCircle from '../PageLoadingCircle.jsx'
import { phoneSchema } from '../../../lib/validation'
import { GET_PHONE, UPDATE_PHONE } from '../../../lib/graphql/queries/user'
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

export default function PhoneForm() {
  const classes = useStyles()
  const { data: session } = useSession()
  const [id, setId] = useState('')
  const [backendError, setBackendError] = useState(null)
  const [updatePhone] = useMutation(UPDATE_PHONE)
  const { data, error, loading } = useQuery(GET_PHONE, {
    variables: { id },
  })

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
          phone: '',
        }}
        validationSchema={phoneSchema}
        onSubmit={async (values, { setSubmitting, setErrors }) => {
          setSubmitting(true)
          console.log(values)
          try {
            await updatePhone({ variables: { phone: values.phone } })
          } catch (error) {
            if (
              error.graphQLErrors &&
              error.graphQLErrors.length > 0 &&
              error.graphQLErrors[0].extensions.detailedMessages
            ) {
              setErrors(error.graphQLErrors[0].extensions.detailedMessages)
            } else {
              console.log(JSON.stringify(error, null, 2))
              setBackendError('Возникла ошибка при сохранении данных')
            }
          } finally {
            setSubmitting(false)
          }
        }}
      >
        {({ isSubmitting, setFieldValue }) => {
          useEffect(() => {
            if (!data.getPhone || !data.getPhone.phone) return
            console.log(data)
            setFieldValue('phone', data.getPhone.phone, false)
          }, [data])

          return (
            <Form className={classes.form} noValidate autoComplete="off">
              <Field
                variant="outlined"
                margin="normal"
                fullWidth
                id="phone"
                label="Номер телефона"
                name="phone"
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
