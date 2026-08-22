import { useRef, useState } from 'react'
import { useTheme } from '@mui/material/styles'
import { Avatar, Button, Typography, Box } from '@mui/material'
import { Formik, Form, Field } from 'formik'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import TextFieldFormik from '../../components/uiParts/formInputs/TextFieldFormik'
import ButtonSubmittingCircle from '../../components/uiParts/ButtonSubmittingCircle'
import Link from '../../components/uiParts/Link'
import { registerSchema } from '../../lib/validation'
import LayoutWithoutHeader from '../../components/layouts/LayoutWithoutHeader'
import ReCAPTCHA from 'react-google-recaptcha'
import { enqueueSnackbar } from 'notistack'
import { useRouter } from 'next/router'
import { userRoles } from '@recycl/shared/dist/constants'
import { useSession } from 'next-auth/react'
import Head from 'next/head'
import LocaleSwitcher from '../../components/uiParts/LocaleSwitcher'

const successMessage = 'Регистрация успешна. Теперь вы можете войти'
const errorMessage = 'Что то пошло не так'
const userExistsMessage = 'Пользователь с таким email уже зарегистрирован'
const brand = process.env.NEXT_PUBLIC_BRAND || ''
const api = '/api/auth/signup/'

export default function SignUp() {
  const theme = useTheme()
  const recaptchaRef = useRef<ReCAPTCHA>(null)
  const [showRecaptcha, setShowRecaptcha] = useState(false)
  const router = useRouter()
  const { locale } = router
  const { status } = useSession()

  if (status === 'authenticated') {
    router.push('/', undefined, { locale })
  }

  return (
    <>
      <Head>
        <title>{`Регистрация | ${brand}`}</title>
        <meta name="robots" content="noindex"></meta>
      </Head>
      <LayoutWithoutHeader>
        <Box sx={{ minWidth: 470 }}>
          <Box sx={{ display: 'flex', justifyContent: 'end' }}>
            <LocaleSwitcher />
          </Box>
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
            <Typography component="h1" variant="h5" textAlign={'center'}>
              Регистрация
            </Typography>
          </Box>

          <Formik
            initialValues={{
              role: userRoles.user,
              name: '',
              email: '',
            }}
            validationSchema={registerSchema}
            onSubmit={async (values, { resetForm }) => {
              if (!showRecaptcha) {
                setShowRecaptcha(true)
                return
              }
              if (!recaptchaRef.current.getValue()) return

              try {
                const response = await fetch(api, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    ...values,
                    recaptcha: recaptchaRef.current.getValue(),
                  }),
                })

                if (response.status === 422) {
                  enqueueSnackbar(userExistsMessage, { variant: 'error' })
                  return
                }

                if (!response.ok) throw new Error(errorMessage)

                enqueueSnackbar(successMessage, { variant: 'success' })
                router.push('/', undefined, { locale })
                resetForm()
              } catch (error) {
                enqueueSnackbar(errorMessage, { variant: 'error' })
              } finally {
                recaptchaRef.current?.reset()
              }
            }}
          >
            {({ isSubmitting, submitForm }) => {
              return (
                <>
                  <Form noValidate autoComplete="off">
                    <Box>
                      <Field type="hidden" name="role" />
                    </Box>
                    <Box sx={{ mb: 2 }}>
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
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Button
                        type="submit"
                        variant="contained"
                        disabled={isSubmitting}
                        fullWidth
                      >
                        Зарегистрироваться
                        {isSubmitting && <ButtonSubmittingCircle />}
                      </Button>
                    </Box>
                  </Form>
                  <Box
                    sx={{ mb: 1, display: 'flex', justifyContent: 'center' }}
                  >
                    <Link
                      href="/auth/login"
                      variant="body2"
                      style={{ color: `${theme.palette.text.secondary}` }}
                    >
                      Вход
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
export async function getStaticProps({ locale }) {
  return {
    props: {
      messages: (await import(`../../messages/${locale}.json`)).default,
    },
  }
}
