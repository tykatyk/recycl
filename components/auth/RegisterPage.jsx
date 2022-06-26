import React, { useState, useRef } from 'react'
import {
  Avatar,
  Button,
  Grid,
  Typography,
  makeStyles,
  useTheme,
  Container,
} from '@material-ui/core'
import { Formik, Form, Field } from 'formik'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import TextFieldFormik from '../uiParts/formInputs/TextFieldFormik.jsx'
import PageLoadingCircle from '../uiParts/PageLoadingCircle.jsx'
import ButtonSubmittingCircle from '../uiParts/ButtonSubmittingCircle.jsx'
import Snackbar from '../uiParts/Snackbars.jsx'
import Link from '../uiParts/Link.jsx'
import { GET_ROLE_ID } from '../../lib/graphql/queries/userRole'
import { useQuery } from '@apollo/client'
import { registerSchema } from '../../lib/validation'
import AuthLayout from '../layouts/AuthLayout.jsx'
import ReCAPTCHA from 'react-google-recaptcha'
import submitWithCapthca from '../../lib/helpers/submitWithCaptcha'

const useStyles = makeStyles((theme) => ({
  root: {
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

export default function SignUp() {
  const classes = useStyles()
  const theme = useTheme()
  const [notification, setNotification] = useState('')
  const [severity, setSeverity] = useState('error')
  const { loading, data, error } = useQuery(GET_ROLE_ID, {
    variables: { roleName: 'user' },
  })
  const [recaptcha, setRecaptcha] = useState(null)
  const [showRecaptcha, setShowRecaptcha] = useState(false)
  const recaptchaRef = useRef(null)

  const handleChange = (token) => {
    setRecaptcha(token)
  }

  if (loading) return <PageLoadingCircle />

  if (error) {
    return <Typography>Возникла ошибка при получении данных</Typography>
  }

  return (
    <>
      <AuthLayout title="Recycl | Регистрация">
        <Container className={classes.root} component="main" maxWidth="xs">
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Регистрация
          </Typography>
          <Formik
            initialValues={{
              role: data.getRoleId,
              name: '',
              email: '',
              password: '',
              confirmPassword: '',
            }}
            validationSchema={registerSchema}
            onSubmit={(values, { setSubmitting, setErrors, resetForm }) => {
              const options = {
                recaptcha,
                recaptchaRef,
                showRecaptcha,
                values,
                endpointUrl: '/api/auth/signup/',
                setRecaptcha,
                setShowRecaptcha,
                setSubmitting,
                setNotification,
                setErrors,
                setSeverity,
                resetForm,
              }
              submitWithCapthca(options)
            }}
          >
            {({ isSubmitting }) => {
              return (
                <Form className={classes.form} noValidate autoComplete="off">
                  <Field type="hidden" name="role" />
                  <Field
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="name"
                    label="Имя или название организации"
                    name="name"
                    component={TextFieldFormik}
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
                    disabled={isSubmitting}
                  >
                    Зарегистрироваться
                    {isSubmitting && <ButtonSubmittingCircle />}
                  </Button>
                </Form>
              )
            }}
          </Formik>

          <Grid
            container
            style={{
              marginBottom: theme.spacing(4),
              justifyContent: 'flex-end',
            }}
          >
            <Grid item>
              <Link
                href="/auth/login"
                variant="body2"
                style={{ color: `${theme.palette.text.secondary}` }}
              >
                Уже есть аккаунт?
              </Link>
            </Grid>
          </Grid>
          <div
            style={{
              display: showRecaptcha ? 'flex' : 'none',
              justifyContent: 'center',
              marginBottom: theme.spacing(4),
            }}
          >
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
              onChange={handleChange}
            />
          </div>
        </Container>
      </AuthLayout>
      <Snackbar
        severity={severity}
        open={!!notification}
        message={notification}
        handleClose={() => setNotification('')}
      />
    </>
  )
}
