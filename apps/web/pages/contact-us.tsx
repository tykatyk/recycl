import { useState, useRef } from 'react'
import { Typography, Box, Button, Container } from '@mui/material'
import Layout from '../components/layouts/Layout'
import { contactUsSchema } from '../lib/validation'
import TextFieldFormik from '../components/uiParts/formInputs/TextFieldFormik'
import ButtonSubmittingCircle from '../components/uiParts/ButtonSubmittingCircle'
import { Formik, Form, Field } from 'formik'
import ReCAPTCHA from 'react-google-recaptcha'
import { useSnackbar } from 'notistack'
import Head from 'next/head'
import { useTranslations } from 'next-intl'

const apiRoute = 'api/contact-us/general'
const limit = 1000
const brand = process.env.NEXT_PUBLIC_BRAND || ''

export default function ContactUsPage() {
  const [recaptchaToken, setRecaptchaToken] = useState(null)
  const recaptchaRef = useRef<ReCAPTCHA>(null)
  const t = useTranslations('ContactUsPage')

  const { enqueueSnackbar } = useSnackbar()

  const handleChange = (token) => {
    setRecaptchaToken(token)
  }

  return (
    <>
      <Head>
        <title>{`${t('title')} | ${brand}`}</title>
      </Head>
      <Layout>
        <Container maxWidth="md">
          <Typography
            component="h1"
            variant="h4"
            align="center"
            sx={{ mt: 2, mb: 3, width: '100%' }}
          >
            {t('h1')}
          </Typography>
          <Formik
            enableReinitialize
            initialValues={{
              subject: '',
              userName: '',
              email: '',
              message: '',
            }}
            validationSchema={contactUsSchema}
            onSubmit={async (
              values,
              { setSubmitting, setErrors, resetForm },
            ) => {
              if (!recaptchaToken) return
              setSubmitting(true)

              try {
                const response = await fetch(apiRoute, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ ...values, recaptchaToken }),
                })

                if (!response.ok) {
                  throw new Error('Something went wrong')
                }
                enqueueSnackbar(t('successMessage'), { variant: 'success' })
                resetForm()
              } catch (error) {
                enqueueSnackbar(t('errorMessage'), { variant: 'error' })
              } finally {
                recaptchaRef.current?.reset()
                setSubmitting(false)
              }
            }}
          >
            {({ isSubmitting, values, setFieldValue }) => {
              let availableSymbols = limit - values.message.length
              availableSymbols = availableSymbols >= 0 ? availableSymbols : 0

              if (values.message.length > limit) {
                setFieldValue(
                  'message',
                  values.message.substring(0, limit),
                  false,
                )
              }

              return (
                <Form>
                  <Box mb={3}>
                    <Typography
                      gutterBottom
                      color="textSecondary"
                      sx={{ fontWeight: 'bold' }}
                    >
                      {t('form.subject')}
                    </Typography>
                    <Field
                      component={TextFieldFormik}
                      variant="outlined"
                      fullWidth
                      name="subject"
                    />
                  </Box>
                  <Box mb={3}>
                    <Typography
                      gutterBottom
                      color="textSecondary"
                      sx={{ fontWeight: 'bold' }}
                    >
                      {t('form.yourName')}
                    </Typography>
                    <Field
                      component={TextFieldFormik}
                      variant="outlined"
                      fullWidth
                      name="userName"
                    />
                  </Box>

                  <Box mb={3}>
                    <Typography
                      gutterBottom
                      color="textSecondary"
                      sx={{ fontWeight: 'bold' }}
                    >
                      {t('form.yourEmail')}
                    </Typography>
                    <Field
                      component={TextFieldFormik}
                      variant="outlined"
                      fullWidth
                      name="email"
                    />
                  </Box>

                  <Box mb={3}>
                    <Typography
                      gutterBottom
                      color="textSecondary"
                      sx={{ fontWeight: 'bold' }}
                    >
                      {t('form.message')}
                    </Typography>
                    <Field
                      component={TextFieldFormik}
                      multiline
                      rows={5}
                      variant="outlined"
                      fullWidth
                      name="message"
                    />

                    <Typography
                      variant="body2"
                      color="textSecondary"
                      sx={{ fontWeight: 'fontWeightLight' }}
                    >
                      {`${t('remainedSymbols')}: ${availableSymbols}`}
                    </Typography>
                  </Box>
                  <Box mb={3}>
                    <ReCAPTCHA
                      ref={recaptchaRef}
                      sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
                      onChange={handleChange}
                    />
                  </Box>
                  <Box mb={3}>
                    <Button
                      variant="contained"
                      type="submit"
                      disabled={isSubmitting}
                    >
                      {t('form.submit')}
                      {isSubmitting && <ButtonSubmittingCircle />}
                    </Button>
                  </Box>
                </Form>
              )
            }}
          </Formik>
        </Container>
      </Layout>
    </>
  )
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      messages: (await import(`../messages/${locale}.json`)).default,
    },
  }
}
