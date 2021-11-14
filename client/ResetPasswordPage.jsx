import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import {
  Avatar,
  Icon,
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
  Grid,
  Box,
  Typography,
  makeStyles,
  useTheme,
  Container,
} from '@material-ui/core'
import { Formik, Form, Field } from 'formik'
import RotateLeftSharpIcon from '@material-ui/icons/RotateLeftSharp'
import GoogleIcon from '@mui/icons-material/Google'
import TextFieldFormik from './uiParts/formInputs/TextFieldFormik.jsx'
import Link from './uiParts/Link.jsx'
import Head from './uiParts/Head.jsx'
import Copyright from './uiParts/Copyright.jsx'
import Snackbar from './uiParts/Snackbars.jsx'
import PageLoadingCircle from './uiParts/PageLoadingCircle.jsx'
import ButtonSubmittingCircle from './uiParts/ButtonSubmittingCircle.jsx'
import { signIn, getSession } from 'next-auth/react'
import * as yup from 'yup'
import { loginSchema } from '../lib/validation/'

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}))

export default function SignIn() {
  const classes = useStyles()
  const theme = useTheme()
  const [backendError, setBackendError] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  /*  useEffect(() => {
    getSession().then((session) => {
      if (session) {
        router.replace('/')
      } else {
        setLoading(false)
      }
    })
  }, [])*/

  /*if (loading) return <PageLoadingCircle />*/

  return (
    <>
      <Head title="Recycl | Reset password" />
      <Container component="main" maxWidth="xs">
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <RotateLeftSharpIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Сброс пароля
          </Typography>
          <Formik
            initialValues={{
              email: '',
              password: '',
            }}
            validationSchema={loginSchema}
            onSubmit={(values, { setSubmitting, setErrors }) => {
              setSubmitting(true)
            }}
          >
            {({ isSubmitting }) => {
              return (
                <Form className={classes.form} noValidate autoComplete="off">
                  <Field
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="password"
                    label="Новый пароль"
                    name="password"
                    component={TextFieldFormik}
                  />
                  <Field
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    name="confirmPassword"
                    label="Повторите пароль"
                    type="password"
                    id="confirmPassword"
                    component={TextFieldFormik}
                  />
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="secondary"
                    className={classes.submit}
                    disabled={isSubmitting}
                  >
                    Отправить
                    {isSubmitting && <ButtonSubmittingCircle />}
                  </Button>
                </Form>
              )
            }}
          </Formik>
          <Box mt={8} mb={4}>
            <Copyright />
          </Box>
        </div>
      </Container>
      <Snackbar
        severity="error"
        open={!!backendError}
        message={backendError}
        handleClose={() => {
          setBackendError(null)
        }}
      />
    </>
  )
}
