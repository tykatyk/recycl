import React, { useState, useRef } from 'react'
import { Box, Button, makeStyles } from '@material-ui/core'
import { useSession } from 'next-auth/react'
import { Formik, Form } from 'formik'
import Snackbar from '../Snackbars.jsx'
import ConfirmDialog from '../ConfirmDialog.jsx'
import ButtonSubmittingCircle from '../ButtonSubmittingCircle.jsx'
import { DELETE_USER } from '../../../lib/graphql/queries/user'
import { useMutation } from '@apollo/client'
import { signOut } from 'next-auth/react'

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

export default function DeleteAccountForm() {
  const classes = useStyles()
  const { data: session } = useSession()
  const [severity, setSeverity] = useState('error')
  const [successMessage, setSuccessMessage] = useState(null)
  const [backendError, setBackendError] = useState(null)
  const [deleteUser] = useMutation(DELETE_USER)
  const message = `Удаление аккаунта приведет к удалению всех ваших данных.
  Это действие нельзя отменить. Вы действительно хотите продолжить?`

  const [open, setOpen] = React.useState(false)

  return (
    <Box className={classes.box}>
      <Formik
        initialValues={{
          userId: session.id,
        }}
        onSubmit={async (values, { setSubmitting, setErrors }) => {
          setSubmitting(true)
          try {
            await deleteUser()
            signOut()
          } catch (error) {
            if (
              error.graphQLErrors &&
              error.graphQLErrors.length > 0 &&
              error.graphQLErrors[0].extensions.detailedMessages
            ) {
              setErrors(error.graphQLErrors[0].extensions.detailedMessages)
            } else {
              setSeverity('error')
              setBackendError('Возникла ошибка при удалении пользователя')
            }
          } finally {
            setSubmitting(false)
          }
        }}
      >
        {({ isSubmitting, submitForm }) => {
          return (
            <>
              <Form className={classes.form} noValidate autoComplete="off">
                <Button
                  type="button"
                  onClick={() => {
                    setOpen(true)
                  }}
                  fullWidth
                  variant="contained"
                  color="secondary"
                  className={classes.submit}
                  disabled={isSubmitting}
                  style={{ width: 'auto' }}
                >
                  Удалить аккаунт
                  {isSubmitting && <ButtonSubmittingCircle />}
                </Button>
              </Form>
              <ConfirmDialog
                title="Подтвердите удаление аккаунта"
                message={message}
                open={open}
                handleConfirm={() => {
                  setOpen(false)
                  submitForm()
                }}
                handleReject={() => {
                  setOpen(false)
                }}
              />
            </>
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
