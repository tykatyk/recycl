import { useRef, useState } from 'react'
import { useTheme } from '@mui/material/styles'
import { Avatar, Button, Typography, Box } from '@mui/material'
import { Formik, Form, Field } from 'formik'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import TextFieldFormik from '../../components/uiParts/formInputs/TextFieldFormik'
import Link from '../../components/uiParts/Link'
import ButtonSubmittingCircle from '../../components/uiParts/ButtonSubmittingCircle'
import { signIn, useSession } from 'next-auth/react'
import LayoutWithoutHeader from '../../components/layouts/LayoutWithoutHeader'
import ReCAPTCHA from 'react-google-recaptcha'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/router'
import Image from 'next/image'
import { email as emailValidator } from '@recycl/shared/dist/validation'
import * as yup from 'yup'
import { enqueueSnackbar } from 'notistack'
import Head from 'next/head'
import { useTranslations } from 'next-intl'
import LocaleSwitcher from '../../components/uiParts/LocaleSwitcher'

const registerUrl = '/auth/register'
const brand = process.env.NEXT_PUBLIC_BRAND || ''

export default function LoginPage() {
  const theme = useTheme()
  const [showRecaptcha, setShowRecaptcha] = useState(false)
  const searchParams = useSearchParams()
  const from = searchParams.get('from')
  const validFrom = from && from[0] === '/' ? from : null
  const callbackUrl = validFrom ? validFrom : process.env.NEXT_PUBLIC_URL
  const { status } = useSession()
  const router = useRouter()
  const { locale } = router
  const recaptchaRef = useRef<ReCAPTCHA>(null)
  const t = useTranslations('LoginPage')

  if (status === 'authenticated') {
    router.push('/', undefined, { locale })
  }

  return (
    <>
      <Head>
        <title>{`${t('title')} | ${brand}`}</title>
        <meta name="robots" content="noindex"></meta>
      </Head>
      <LayoutWithoutHeader>
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'end' }}>
            <LocaleSwitcher />
          </Box>
          <Box
            sx={{
              mt: 3,
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
            <Typography component="h1" variant="h4">
              {t('h1')}
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

                if (!result) throw new Error(t('errorMessage'))

                if (result.error) {
                  if (result.error === 'AccessDenied') {
                    enqueueSnackbar(t('userNotFound'), { variant: 'error' })
                    return
                  } else {
                    throw new Error(t('errorMessage'))
                  }
                }

                enqueueSnackbar(t('linkSent'), { variant: 'success' })
                resetForm()
                router.push('/', undefined, { locale })
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
                          label={t('yourEmail')}
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
                          {t('submit')}
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
                      {t('signInWithGoogle')}
                    </Button>
                  </Box>

                  <Box
                    sx={{ mb: 1, display: 'flex', justifyContent: 'center' }}
                  >
                    <Link
                      href={registerUrl}
                      variant="body2"
                      style={{ color: `${theme.palette.text.secondary}` }}
                      locale={locale}
                    >
                      {t('signUp')}
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
