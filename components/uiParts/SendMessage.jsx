import { React, useState } from 'react'
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  makeStyles,
} from '@material-ui/core'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import * as yup from 'yup'
import TextFieldFormik from './formInputs/TextFieldFormik.jsx'
import Snackbars from './Snackbars.jsx'
import { Formik, Form, Field } from 'formik'
import { useMutation } from '@apollo/client'
import { CREATE_MESSAGE } from '../../lib/graphql/queries/message'

const useStyles = makeStyles((theme) => ({
  root: {
    '& > fieldset': {
      margin: 0,
      marginBottom: theme.spacing(5),
      padding: 0,
      border: 'none',
    },
  },
  relativePosition: {
    position: 'relative',
  },
  remainedSymbols: {
    color: theme.palette.grey['400'],
  },
  shim: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
}))

export default function SendMessage(props) {
  const classes = useStyles()
  const theme = useTheme()
  const router = useRouter()
  const { id } = router.query
  const limit = 1000
  const { receiver } = props
  const [createMessageMutation, { loading }] = useMutation(CREATE_MESSAGE)
  const [notificationOpen, setNotificationOpen] = useState(false)
  const [severity, setSeverity] = useState('')
  const [message, setMessage] = useState('')

  const submitHandler = (values, setSubmitting, resetForm) => {
    const sender = session.id
    if (sender == receiver) {
      setSeverity('error')
      setMessage('Нельзя отправлять сообщения самому себе')
      setNotificationOpen(true)
      setSubmitting(false)
      return
    }
    createMessageMutation({
      variables: {
        message: { text: values.message, ad: id, sender: session.id, receiver },
      },
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

  const handleClick = (e) => {
    if (status != 'authenticated') {
      router.push({
        pathname: '/auth/login',
        query: {
          from: router.asPath,
        },
      })
    }
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
        {({ isSubmitting, values, setFieldValue }) => {
          let availableSymbols = limit - values.message.length
          availableSymbols = availableSymbols >= 0 ? availableSymbols : 0

          if (values.message.length > limit) {
            setFieldValue('message', values.message.substring(0, limit), false)
          }

          return (
            <Form className={classes.root}>
              <Box className={classes.relativePosition}>
                <Field
                  component={TextFieldFormik}
                  multiline
                  rows={4}
                  variant="outlined"
                  fullWidth
                  name="message"
                  disabled={status !== 'authenticated'}
                />
                {status !== 'authenticated' && (
                  <div
                    className={classes.shim}
                    onClick={(e) => {
                      handleClick(e)
                    }}
                  ></div>
                )}
              </Box>
              <Box mb={3}>
                <Typography variant="body2" className={classes.remainedSymbols}>
                  Осталось: {availableSymbols}
                </Typography>
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
                      color="secondary"
                      style={{
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
