import { useEffect, useRef, useState } from 'react'
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
import { useRouter } from 'next/router'
import Image from 'next/image'
import { email as emailValidator } from '@recycl/shared/dist/validation'
import * as yup from 'yup'
import { enqueueSnackbar } from 'notistack'
import Head from 'next/head'
import { useTranslations } from 'next-intl'
import LocaleSwitcher from '../../components/uiParts/LocaleSwitcher'
import { validateForm } from '../../lib/helpers/errorHelpers'
import CanonicalUrl from '../../components/uiParts/CanonicalUrl'

const registerUrl = '/auth/register'
const brand = process.env.NEXT_PUBLIC_BRAND || ''

export default function LoginPage() {
  const theme = useTheme()
  const [showRecaptcha, setShowRecaptcha] = useState(false)
  const router = useRouter()
  const { locale, locales, defaultLocale, asPath, query } = router
  const { from } = query
  const validFrom =
    typeof from === 'string' && from.startsWith('/') && !from.startsWith('//')
      ? from
      : ''
  const callbackUrl = validFrom ? validFrom : process.env.NEXT_PUBLIC_URL || ''
  const { status } = useSession()

  const recaptchaRef = useRef<ReCAPTCHA>(null)
  const t = useTranslations('LoginPage')
  const tValidationMessages = useTranslations('ValidationMessages')

  useEffect(() => {
    if (status === 'authenticated') {
      router.replace('/', undefined, { locale })
    }
  }, [status, locale, router])

  return (
    <>
      <Head>
        <title>{`${t('title')} | ${brand}`}</title>
        <meta name="robots" content="noindex"></meta>
        <CanonicalUrl
          asPath={asPath}
          locale={locale}
          defaultLocale={defaultLocale}
          locales={locales}
        />
      </Head>
      <LayoutWithoutHeader>
        <Box sx={{ width: '100%', maxWidth: 470 }}>
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
            validate={async (values) => {
              return await validateForm({
                values,
                validationSchema: yup.object({
                  email: emailValidator,
                }),
                translations: tValidationMessages,
              })
            }}
            onSubmit={async (values, { resetForm }) => {
              try {
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
                enqueueSnackbar(t('errorMessage'), { variant: 'error' })
              }
            }}
          >
            {({ isSubmitting, submitForm, validateForm, setTouched }) => {
              return (
                <>
                  <Box sx={{ mb: 2 }}>
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
                          fullWidth
                          variant="contained"
                          disabled={isSubmitting}
                          onClick={async () => {
                            const errors = await validateForm()

                            if (Object.keys(errors).length > 0) {
                              setTouched(
                                Object.keys(errors).reduce(
                                  (acc, key) => ({ ...acc, [key]: true }),
                                  {},
                                ),
                              )
                              return
                            }

                            if (!showRecaptcha) {
                              setShowRecaptcha(true)
                            } else {
                              recaptchaRef.current?.reset()
                            }
                          }}
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
                      sx={{ color: 'text.secondary' }}
                      locale={locale}
                    >
                      {t('signUp')}
                    </Link>
                  </Box>

                  {showRecaptcha && (
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                      }}
                    >
                      <ReCAPTCHA
                        ref={recaptchaRef}
                        sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
                        onChange={() => submitForm()}
                      />
                    </Box>
                  )}
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
      messages: (await import(`../../messages/${locale}`)).default,
    },
  }
}
