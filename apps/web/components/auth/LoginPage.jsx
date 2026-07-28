import { useState } from 'react'
import { styled, useTheme } from '@mui/material/styles'
import { Avatar, Button, Grid, Typography, Container, Box } from '@mui/material'
import { Formik, Form, Field } from 'formik'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import TextFieldFormik from '../uiParts/formInputs/TextFieldFormik'
import Link from '../uiParts/Link'
import Snackbar from '../uiParts/Snackbars'
import ButtonSubmittingCircle from '../uiParts/ButtonSubmittingCircle'
import { signIn, useSession } from 'next-auth/react'
import { loginSchema } from '../../lib/validation'
import { showErrorMessages } from '../../lib/helpers/errorHelpers'
import LayoutWithoutHeader from '../layouts/LayoutWithoutHeader'
import ReCAPTCHA from 'react-google-recaptcha'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/router'
import Image from 'next/image'

const USER_NOT_FOUND = 'Пользователь с таким email не найден'
const LINK_SENT = 'На вашу электронную почту отправлена ссылка для входа'
const LOGIN_WITH_GOOGLE = 'Войти через Google'
const EMAIL_LABEL = 'Электронная почта'
const SIGN_IN = 'Войти'
const SIGN_UP = 'Регистрация'
const PREFIX = 'LoginPage'
const REGISTER_URL = '/auth/register'
const GOOGLE_AUTH_CALLBACK = `${process.env.HOST}/api/auth/callback/google`

const classes = {
  paper: `${PREFIX}-paper`,
  avatar: `${PREFIX}-avatar`,
  form: `${PREFIX}-form`,
  submit: `${PREFIX}-submit`,
}

// TODO jss-to-styled codemod: The Fragment root was replaced by div. Change the tag if needed.
const Root = styled('div')(({ theme }) => ({
  [`& .${classes.paper}`]: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },

  [`& .${classes.avatar}`]: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.primary.main,
  },

  [`& .${classes.form}`]: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },

  [`& .${classes.submit}`]: {
    marginBottom: theme.spacing(2),
  },
}))

export default function SignIn() {
  const theme = useTheme()
  const [notificatioin, setNotification] = useState('')
  const [notificatioinType, setNotificationType] = useState('success')
  const [recaptcha, setRecaptcha] = useState(null)
  const [showRecaptcha, setShowRecaptcha] = useState(false)
  const searchParams = useSearchParams()
  const from = searchParams.get('from')
  const validFrom = from && from[0] === '/' ? from : null
  const callbackUrl = validFrom ? validFrom : process.env.NEXT_PUBLIC_URL
  const { status } = useSession()
  const router = useRouter()

  if (status === 'authenticated') {
    router.push('/')
  }

  const handleChange = (token) => {
    setRecaptcha(token)
  }

  return (
    <Root>
      <LayoutWithoutHeader title="Вход | Recycl">
        <Container component="main" maxWidth="xs">
          <div className={classes.paper}>
            <Avatar className={classes.avatar}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Вход
            </Typography>
            <Formik
              initialValues={{
                email: '',
              }}
              validationSchema={loginSchema}
              onSubmit={(values, { setSubmitting, setErrors, resetForm }) => {
                setSubmitting(true)

                if (!showRecaptcha) {
                  setShowRecaptcha(true)
                  setSubmitting(false)
                  return
                }

                if (!recaptcha) {
                  setSubmitting(false)
                  return
                }

                signIn('email', {
                  email: values.email,
                  redirect: false,
                  callbackUrl,
                })
                  .then((data) => {
                    if (data.error) {
                      setSubmitting(false)
                      setNotificationType('error')

                      let modifiedError = data.error

                      if (data.error === 'AccessDenied') {
                        modifiedError = {
                          type: 'perForm',
                          message: USER_NOT_FOUND,
                        }
                      }
                      showErrorMessages(
                        modifiedError,
                        setErrors,
                        setNotification,
                      )
                      return
                    }
                    setNotificationType('success')
                    setNotification(LINK_SENT)
                    resetForm()
                  })
                  .finally(() => {
                    setSubmitting(false)
                  })
              }}
            >
              {({ isSubmitting }) => {
                return (
                  <Form className={classes.form} noValidate autoComplete="off">
                    <Box sx={{ mb: 2 }}>
                      <Field
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label={EMAIL_LABEL}
                        name="email"
                        component={TextFieldFormik}
                      />
                    </Box>

                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      className={classes.submit}
                      disabled={isSubmitting}
                    >
                      {SIGN_IN}
                      {isSubmitting && <ButtonSubmittingCircle />}
                    </Button>
                  </Form>
                )
              }}
            </Formik>
            <Formik
              initialValues={{
                googleAuthCallback: GOOGLE_AUTH_CALLBACK,
              }}
              onSubmit={async (values, { setSubmitting }) => {
                setSubmitting(true)
                await signIn('google', {
                  callbackUrl,
                })
                setSubmitting(false)
              }}
            >
              {({ isSubmitting }) => {
                return (
                  <Form className={classes.form} noValidate autoComplete="off">
                    <Field
                      sx={{ display: 'none', visibility: 'hidden' }}
                      name="googleAuthCallback"
                      type="hidden"
                      component={TextFieldFormik}
                    />
                    <Button
                      sx={{
                        background: '#fff',
                        '&.Mui-disabled': {
                          color: 'grey.900', // Your custom text color
                          backgroundColor: '#fff', // Optional: background color
                        },
                      }}
                      type="submit"
                      fullWidth
                      variant="contained"
                      className={classes.submit}
                      disabled={isSubmitting}
                      startIcon={
                        <Image
                          src="/images/googleLogo.svg"
                          alt="Google"
                          width={24}
                          height={24}
                        />
                      }
                    >
                      {LOGIN_WITH_GOOGLE}
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
              <Grid>
                <Link
                  href={REGISTER_URL}
                  variant="body2"
                  style={{ color: `${theme.palette.text.secondary}` }}
                >
                  {SIGN_UP}
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
                sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
                onChange={handleChange}
              />
            </div>
          </div>
        </Container>
      </LayoutWithoutHeader>

      <Snackbar
        severity={notificatioinType}
        open={!!notificatioin}
        message={notificatioin}
        handleClose={() => {
          setNotification('')
        }}
      />
    </Root>
  )
}
