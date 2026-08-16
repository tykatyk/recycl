import { useRef, useState } from 'react'
import { useTheme } from '@mui/material/styles'
import { Avatar, Button, Typography, Box } from '@mui/material'
import { Formik, Form, Field } from 'formik'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import TextFieldFormik from '../uiParts/formInputs/TextFieldFormik'
import Link from '../uiParts/Link'
import ButtonSubmittingCircle from '../uiParts/ButtonSubmittingCircle'
import { signIn, useSession } from 'next-auth/react'
import LayoutWithoutHeader from '../layouts/LayoutWithoutHeader'
import ReCAPTCHA from 'react-google-recaptcha'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/router'
import Image from 'next/image'
import { email as emailValidator } from '@recycl/shared/dist/validation'
import * as yup from 'yup'
import { enqueueSnackbar } from 'notistack'
import Head from 'next/head'

const USER_NOT_FOUND = 'Пользователь с таким email не найден'
const LINK_SENT = 'На вашу электронную почту отправлена ссылка для входа'
const LOGIN_WITH_GOOGLE = 'Войти через Google'
const EMAIL_LABEL = 'Адрес электронной почты'
const SIGN_IN = 'Войти'
const SIGN_UP = 'Регистрация'
const REGISTER_URL = '/auth/register'

const errorMessage = 'Что то пошло не так'
const brand = process.env.NEXT_PUBLIC_BRAND || ''

export default function SignIn() {
  const theme = useTheme()
  const [showRecaptcha, setShowRecaptcha] = useState(false)
  const searchParams = useSearchParams()
  const from = searchParams.get('from')
  const validFrom = from && from[0] === '/' ? from : null
  const callbackUrl = validFrom ? validFrom : process.env.NEXT_PUBLIC_URL
  const { status } = useSession()
  const router = useRouter()
  const recaptchaRef = useRef<ReCAPTCHA>(null)

  if (status === 'authenticated') {
    router.push('/')
  }

  return (
    <>
      <Head>
        <title>{`Вход | ${brand}`}</title>
        <meta name="robots" content="noindex"></meta>
      </Head>
      <LayoutWithoutHeader>
        <Box>
          <Box
            sx={{
              mb: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar
              sx={{
                margin: theme.spacing(1),
                backgroundColor: theme.palette.primary.main,
              }}
            >
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Вход
            </Typography>
          </Box>

          <Formik
            initialValues={{
              email: '',
            }}
            validationSchema={yup.object({
              email: emailValidator,
            })}
            onSubmit={async (values, { resetForm }) => {
              try {
                if (!showRecaptcha) {
                  setShowRecaptcha(true)
                  return
                }
                if (!recaptchaRef.current.getValue()) return

                const result = await signIn('email', {
                  email: values.email,
                  redirect: false,
                  callbackUrl,
                })

                if (!result) throw new Error(errorMessage)

                if (result.error) {
                  if (result.error === 'AccessDenied') {
                    enqueueSnackbar(USER_NOT_FOUND, { variant: 'error' })
                    return
                  } else {
                    throw new Error(errorMessage)
                  }
                }

                enqueueSnackbar(LINK_SENT, { variant: 'success' })
                resetForm()
                router.push('/')
              } catch (error) {
              } finally {
                recaptchaRef.current?.reset()
              }
            }}
          >
            {({ isSubmitting, submitForm }) => {
              return (
                <>
                  <Box sx={{ mb: 2, minWidth: 470 }}>
                    <Form noValidate autoComplete="off">
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
                      <Box>
                        <Button
                          type="submit"
                          fullWidth
                          variant="contained"
                          disabled={isSubmitting}
                        >
                          {SIGN_IN}
                          {isSubmitting && <ButtonSubmittingCircle />}
                        </Button>
                      </Box>
                    </Form>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Button
                      onClick={async () =>
                        await signIn('google', {
                          callbackUrl,
                        })
                      }
                      sx={{
                        background: '#fff',
                        '&.Mui-disabled': {
                          color: 'grey.900',
                          backgroundColor: '#fff',
                        },
                      }}
                      fullWidth
                      variant="contained"
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
                  </Box>

                  <Box
                    sx={{ mb: 1, display: 'flex', justifyContent: 'center' }}
                  >
                    <Link
                      href={REGISTER_URL}
                      variant="body2"
                      style={{ color: `${theme.palette.text.secondary}` }}
                    >
                      {SIGN_UP}
                    </Link>
                  </Box>

                  <Box
                    sx={{
                      display: showRecaptcha ? 'flex' : 'none',
                      justifyContent: 'center',
                    }}
                  >
                    <ReCAPTCHA
                      ref={recaptchaRef}
                      sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
                      onChange={() => submitForm()}
                    />
                  </Box>
                </>
              )
            }}
          </Formik>
        </Box>
      </LayoutWithoutHeader>
    </>
  )
}
