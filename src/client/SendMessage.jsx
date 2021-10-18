import { React, useEffect } from 'react'
import {
  TextField,
  Box,
  Typography,
  Button,
  CircularProgress,
  useTheme,
} from '@material-ui/core'

import * as yup from 'yup'

import TextFieldFormik from './TextFieldFormik.jsx'
import Snackbars from './Snackbars.jsx'

import { Formik, Form, Field } from 'formik'
import removalFormStyles from './removalApplication/removalFormStyles'

import { useMutation } from '@apollo/client'
import { SEND_MESSAGE } from '../server/graphqlQueries'

const useStyles = removalFormStyles

export default function SendMessage() {
  const classes = useStyles()
  const theme = useTheme()

  const [createMessageMutation, { data, loading, error }] =
    useMutation(SEND_MESSAGE)

  const submitHandler = (values, setSubmitting) => {
    createMessageMutation({
      variables: { message: values },
      fetchPolicy: 'no-cache',
    })
      .then((data) => {
        setSubmitting(false)
      })
      .catch((err) => {
        //ToDo
      })
  }

  return (
    <Box p={3} style={{ background: theme.palette.primary.main }}>
      {data && (
        <Snackbars
          open={true}
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
        onSubmit={(values, { setSubmitting }) => {
          submitHandler(values, setSubmitting)
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
                    ''
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
