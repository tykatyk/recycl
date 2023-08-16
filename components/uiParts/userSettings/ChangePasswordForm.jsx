import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Button, Box, makeStyles } from '@material-ui/core'
import { Formik, Form, Field } from 'formik'
import Snackbar from '../Snackbars'
import TextFieldFormik from '../formInputs/TextFieldFormik'
import ButtonSubmittingCircle from '../ButtonSubmittingCircle'
import { changePasswordSchema } from '../../../lib/validation'
import { UPDATE_PASSWORD } from '../../../lib/graphql/queries/user'
import { useMutation } from '@apollo/client'

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

export default function ChangePasswordForm() {
  const classes = useStyles()
  const { data: session } = useSession()
  const [severity, setSeverity] = useState('error')
  const [notification, setNotification] = useState('')
  const [updatePassword, { data: updateData }] = useMutation(UPDATE_PASSWORD)

  return (
    <Box className={classes.box}>
      <Formik
        initialValues={{
          oldPassword: '',
          newPassword: '',
        }}
        validationSchema={changePasswordSchema}
        onSubmit={async (values, { setSubmitting, setErrors }) => {
          setSubmitting(true)
          try {
            await updatePassword({
              variables: {
                oldPassword: values.oldPassword,
                newPassword: values.newPassword,
              },
            })
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
        {({ isSubmitting, resetForm }) => {
          useEffect(() => {
            if (updateData && updateData.updatePassword) {
              setSeverity('success')
              setNotification('Данные успешно обновлены')
              resetForm()
            }
          }, [updateData])

          return (
            <Form className={classes.form} noValidate autoComplete="off">
              <Field
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="oldPassword"
                label="Текущий пароль"
                name="oldPassword"
                type="password"
                component={TextFieldFormik}
                className={classes.field}
              />
              <Field
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="newPassword"
                label="Новый пароль"
                name="newPassword"
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
    </Box>
  )
}
