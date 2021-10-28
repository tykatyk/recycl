import React from 'react'
import {
  Avatar,
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
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import TextFieldFormik from './uiParts/formInputs/TextFieldFormik.jsx'
import Link from './uiParts/Link.jsx'
import * as yup from 'yup'
import { getCsrfToken } from 'next-auth/react'

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href={`${process.env.NEXT_PUBLIC_PRODUCTION_URL}`}>
        Recycl
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  )
}

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

const required = '*Обязательное поле'

export default function SignIn({ csrfToken }) {
  const classes = useStyles()
  const theme = useTheme()

  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Регистрация
        </Typography>
        <Formik
          initialValues={{
            csrfToken: csrfToken,
            role: 'user',
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
          }}
          validationSchema={yup.object().shape({
            username: yup
              .string()
              .required(required)
              .min(3, 'Минимум 3 символа')
              .max(255, 'Максимум 255 символов'),
            email: yup
              .string()
              .required(required)
              .email('Недействительный адрес электронной почты'),
            password: yup
              .string()
              .required(required)
              .min(6, 'Минимум 6 символов')
              .max(255, 'Максимум 255 символов'),
            confirmPassword: yup
              .string()
              .oneOf([yup.ref('password'), null], 'Пароли не совпадают!')
              .required(required),
          })}
          onSubmit={(values, { setSubmitting }) => {
            setSubmitting(true)
            const res = fetch('/api/auth/register', {
              method: 'POST',
              body: JSON.stringify(values),
              headers: { 'Content-Type': 'application/json' },
            })
              .then((res) => {
                console.log('response is ')
                console.log(res)
                return res.json()
              })
              .then((user) => {
                console.log('user is ' + user)
              })
              .catch((error) => {
                console.log('got an error ' + error)
              })

            setSubmitting(false)
          }}
        >
          {({ isSubmitting }) => {
            return (
              <Form className={classes.form} noValidate autoComplete="off">
                <Field type="hidden" name="csrfToken" />
                <Field type="hidden" name="role" />
                <Field
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="username"
                  label="Имя или название организации"
                  name="username"
                  component={TextFieldFormik}
                  autoFocus
                />
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
                <Field
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Пароль"
                  type="password"
                  id="password"
                  component={TextFieldFormik}
                />
                <Field
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  name="confirmPassword"
                  label="Пароль повторно"
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
                >
                  Зарегистрироваться
                </Button>
                <Grid container style={{ justifyContent: 'flex-end' }}>
                  <Grid item>
                    <Link
                      href="#"
                      variant="body2"
                      style={{ color: `${theme.palette.text.secondary}` }}
                    >
                      {'Уже есть аккаунт? Войдите'}
                    </Link>
                  </Grid>
                </Grid>
              </Form>
            )
          }}
        </Formik>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  )
}

export async function getServerSideProps(context) {
  return { props: { csrfToken: await getCsrfToken(context) } }
}
