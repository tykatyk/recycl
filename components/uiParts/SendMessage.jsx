import { React, useState } from 'react'
import { styled } from '@mui/material/styles'
import { Box, Typography, Button } from '@mui/material'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import * as yup from 'yup'
import TextFieldFormik from './formInputs/TextFieldFormik'
import Snackbars from './Snackbars'
import ButtonSubmittingCircle from './ButtonSubmittingCircle'
import { Formik, Form, Field } from 'formik'
import { useMutation } from '@apollo/client'
import { CREATE_MESSAGE } from '../../lib/graphql/queries/message'
import { whitespaceRegex } from '../../lib/validation/regularExpressions'

const PREFIX = 'SendMessage'

const classes = {
  root: `${PREFIX}-root`,
  relativePosition: `${PREFIX}-relativePosition`,
  remainedSymbols: `${PREFIX}-remainedSymbols`,
  shim: `${PREFIX}-shim`,
}

const StyledBox = styled(Box)(({ theme }) => ({
  [`& .${classes.root}`]: {
    '& > fieldset': {
      margin: 0,
      marginBottom: theme.spacing(5),
      padding: 0,
      border: 'none',
    },
  },

  [`& .${classes.relativePosition}`]: {
    position: 'relative',
  },

  [`& .${classes.remainedSymbols}`]: {
    color: theme.palette.grey['400'],
  },

  [`& .${classes.shim}`]: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
}))

export default function SendMessage(props) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { id } = router.query
  const limit = 1000
  const { receiver } = props
  const [createMessageMutation, { loading }] = useMutation(CREATE_MESSAGE)
  const [notification, setNotification] = useState('')
  const [severity, setSeverity] = useState('success')

  const submitHandler = (values, setSubmitting, resetForm) => {
    const sender = session.id
    if (sender == receiver._id) {
      setSeverity('error')
      setNotification('Нельзя отправлять сообщения самому себе')
      setSubmitting(false)
      return
    }

    //dialogInitiatorId and dialogReceiverId are needed
    //to separetely delete dialogs by sender and receiver of messages
    //so that the other user can still see dialogs messages
    createMessageMutation({
      variables: {
        message: {
          text: values.message,
          ad: id,
          senderId: session.id,
          senderName: session.user.name,
          receiverId: receiver._id,
          receiverName: receiver.name,
          dialogId: session.id.concat(id), //concatenate sender id and ad id
          dialogInitiatorId: session.id,
          dialogReceiverId: receiver._id,
        },
      },
      fetchPolicy: 'no-cache',
    })
      .then((data) => {
        setSeverity('success')
        setNotification('Сообщение отправлено')
        resetForm({ values: '' })
      })
      .catch((error) => {
        setSeverity('error')
        setNotification('Ошибка при отправке сообщения')
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
    <StyledBox>
      <Snackbars
        open={!!notification}
        handleClose={() => setNotification('')}
        message={notification}
        severity={severity}
      />
      <Typography variant="h6" gutterBottom>
        Написать сообщение автору
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
                  rows={5}
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
                    values.message.replace(whitespaceRegex, '') === '' ||
                    loading
                  }
                >
                  Отправить
                  {isSubmitting && <ButtonSubmittingCircle />}
                </Button>
              </Box>
            </Form>
          )
        }}
      </Formik>
    </StyledBox>
  )
}
