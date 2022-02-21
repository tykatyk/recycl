import { React, useState } from 'react'
import {
  TextField,
  Box,
  Typography,
  Button,
  CircularProgress,
  useTheme,
} from '@material-ui/core'

import * as yup from 'yup'

import TextFieldFormik from './formInputs/TextFieldFormik.jsx'
import Snackbars from './Snackbars.jsx'

import { Formik, Form, Field } from 'formik'
import removalFormStyles from '../removalApplicationPage/removalFormStyles'

import { useMutation } from '@apollo/client'
import { CREATE_MESSAGE } from '../../lib/graphql/queries/message'
import { useRouter } from 'next/router'

const useStyles = removalFormStyles

export default function SendMessage() {
  const classes = useStyles()
  const theme = useTheme()
  const router = useRouter()
  const { id } = router.query

  const [createMessageMutation, { data, loading, error }] =
    useMutation(CREATE_MESSAGE)
  const { showNotification, setShowNotification } = useState(!!data)

  const submitHandler = (values, setSubmitting, resetForm) => {
    createMessageMutation({
      variables: { message: values.message, aplId: id },
      fetchPolicy: 'no-cache',
    })
      .then((data) => {
        setSubmitting(false)
        resetForm({ values: '' })
      })
      .catch((err) => {
        //ToDo
      })
  }
  return (
    <Box p={3} style={{ background: theme.palette.primary.main }}>
      {data && (
        <Snackbars
          open={showNotification}
          onClose={() => {
            setShowNotification(false)
          }}
          message="Сообщение отправлено"
          severity="success"
        />
      )}
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
            <Form className={classes.formRoot}>
              <Box mb={3}>
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
