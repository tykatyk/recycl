import { React, useState } from 'react'
import {
  TextField,
  Box,
  Typography,
  Button,
  CircularProgress,
  makeStyles,
  useTheme,
} from '@material-ui/core'

import * as yup from 'yup'

import TextFieldFormik from './formInputs/TextFieldFormik.jsx'
import Snackbars from './Snackbars.jsx'
import { Formik, Form, Field } from 'formik'
import { useMutation } from '@apollo/client'
import { CREATE_MESSAGE } from '../../lib/graphql/queries/message'
import { useRouter } from 'next/router'

const useStyles = makeStyles((theme) => ({
  root: {
    '& > fieldset': {
      margin: 0,
      marginBottom: theme.spacing(5),
      padding: 0,
      border: 'none',
    },
  },
}))

export default function SendMessage() {
  const classes = useStyles()
  const theme = useTheme()
  const router = useRouter()
  const { id } = router.query

  const [notificationOpen, setNotificationOpen] = useState(false)
  const [severity, setSeverity] = useState('')
  const [message, setMessage] = useState('')

  const submitHandler = (values, setSubmitting, resetForm) => {
    createMessageMutation({
      variables: { message: values.message, aplId: id },
      fetchPolicy: 'no-cache',
    })
      .then((data) => {
        setSeverity('success')
        setMessage('Сообщение отправлено')
        setNotificationOpen(true)
        resetForm({ values: '' })
      })
      .catch((error) => {
        setSeverity('error')
        setMessage('Ошибка при отправке сообщения')
        setNotificationOpen(true)
      })
      .finally(() => {
        setSubmitting(false)
      })
  }
  return (
    <Box>
      <Snackbars
        open={notificationOpen}
        handleClose={() => {
          setNotificationOpen(false)
        }}
        message={message}
        severity={severity}
      />
      <Typography variant="h6" gutterBottom>
        Написать сообщение
      </Typography>
      <Formik
        enableReinitialize
        initialValues={{
          message: '',
        }}
        validationSchema={yup.object().shape({
          message: yup.string(),
        })}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          submitHandler(values, setSubmitting, resetForm)
        }}
      >
        {({ isSubmitting, values }) => {
          return (
            <Form className={classes.root}>
                <Field
                  component={TextFieldFormik}
                  multiline
                  rows={3}
                  variant="outlined"
                  fullWidth
                  name="message"
                />
              </Box>

              <Box>
                <Button
                  variant="contained"
                  color="secondary"
                  type="submit"
                  disabled={
                    values.message.replace(/^\s+/, '').replace(/\s+$/, '') ===
                      '' || loading
                  }
                >
                  Отправить
                  {isSubmitting && (
                    <CircularProgress
                      size={24}
                      style={{
                        color: theme.palette.secondary.main,
                        marginLeft: '1em',
                      }}
                    />
                  )}
                </Button>
              </Box>
            </Form>
          )
        }}
      </Formik>
    </Box>
  )
}
