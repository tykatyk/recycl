import React, { useState, useRef } from 'react'
import { styled } from '@mui/material/styles'
import { Box, Button } from '@mui/material'
import { useSession } from 'next-auth/react'
import { Formik, Form } from 'formik'
import Snackbar from '../Snackbars'
import ConfirmDialog from '../ConfirmDialog'
import ButtonSubmittingCircle from '../ButtonSubmittingCircle'
import { DELETE_USER } from '../../../lib/graphql/queries/user'
import { useMutation } from '@apollo/client'
import { signOut } from 'next-auth/react'

const PREFIX = 'DeleteAccountForm'

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

export default function DeleteAccountForm() {
  const { data: session } = useSession()
  const [severity, setSeverity] = useState('error')
  const [notification, setNotification] = useState('')
  const [deleteUser] = useMutation(DELETE_USER)
  const message = `Удаление аккаунта приведет к удалению всех ваших данных.
  Это действие нельзя отменить. Вы действительно хотите продолжить?`

  const [open, setOpen] = React.useState(false)

  return (
    <StyledBox className={classes.box}>
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
              setNotification('Возникла ошибка при удалении пользователя')
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
        open={!!notification}
        message={notification}
        handleClose={() => {
          setNotification('')
        }}
      />
    </StyledBox>
  )
}
