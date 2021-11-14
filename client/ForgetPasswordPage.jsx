import React from 'react'
import {
  Typography,
  Box,
  Button,
  makeStyles,
  useTheme,
  Container,
} from '@material-ui/core'
import { Formik, Form, Field } from 'formik'
import Head from './uiParts/Head.jsx'
import Copyright from './uiParts/Copyright.jsx'
import TextFieldFormik from './uiParts/formInputs/TextFieldFormik.jsx'
import ButtonSubmittingCircle from './uiParts/ButtonSubmittingCircle.jsx'
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

export default function ForgotPassword() {
  const classes = useStyles()
  const theme = useTheme()

  return (
    <>
      <Head title="Recycl | Forgot password" />
      <Container component="main" maxWidth="xs">
        <div className={classes.paper}>
          <Typography component="h1" variant="h3" align="center" gutterBottom>
            Сброс пароля
          </Typography>
          <Typography align="center">
            Введите ваш email и мы вышлем вам код подтверждения. Вы сможете
            установить новый пароль после перехода по ссылке из полученного
            письма.
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
                    id="email"
                    label="Электронная почта"
                    name="email"
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
    </>
  )
}
