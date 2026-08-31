import { Typography, Box, Grid, Button, Alert } from '@mui/material'
import { Formik, FormikHelpers, Form, Field } from 'formik'
import { useEffect, useState } from 'react'
import { email } from '@recycl/shared/dist/validation'
import ButtonSubmittingCircle from '../uiParts/ButtonSubmittingCircle'
import TextFieldFormik from '../uiParts/formInputs/TextFieldFormik'
import CustomSnackbar from '../uiParts/Snackbars'
import Link from '../uiParts/Link'
import {
  responseErrrorCodes,
  responseStatuses,
} from '../../lib/helpers/errorHelpers'
import type { ApiResponseStatus } from '../../lib/helpers/responses'
import { useTranslations } from 'next-intl'

const unsubscribeAPI = '/api/my/subscriptions/unsubscribe'
const { SUCCESS, ERROR } = responseStatuses
const { NOT_FOUND } = responseErrrorCodes

export default function TokenNotFound() {
  const [message, setMessage] = useState<string>('')
  const [severity, setSeverity] = useState<string>('success')
  const [data, setData] = useState<ApiResponseStatus | null>(null)
  const t = useTranslations('TokenNotFound')

  const handleTokenNotFound = async (email: string) => {
    try {
      const response = await fetch(unsubscribeAPI, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ scope: 'email', data: email }),
      })
      if (!response.ok) {
        setSeverity('error')
        if (response.status == 400) {
          setMessage(t('incorrectEmail'))
        } else if (response.status == 404) {
          setMessage(t('userNotFound'))
        } else {
          throw new Error(t('errorMessage'))
        }
      }

      const data = await response.json()

      setData(data)
    } catch (error) {
      setMessage(t('errorMessage'))
    }
  }

  useEffect(() => {
    if (!data) return

    switch (data.status) {
      case SUCCESS:
        setSeverity('success')
        setMessage(t('letterSent'))
        break

      case ERROR: {
        if (data.error.code === NOT_FOUND) {
          setSeverity('success')
          setMessage(t('addressNotSubscribed'))
        }
        break
      }

      default:
        setSeverity('error')
        setMessage(t('errorMessage'))
        break
    }
  }, [data])

  return (
    <>
      <Typography variant="h4" component="h1" sx={{ mb: 4 }} align="center">
        {t('linkNotValid')}
      </Typography>
      <Typography sx={{ mb: 2 }} align="center">
        {t('unsubscribeAll')}
      </Typography>
      <Typography sx={{ mb: 2 }} align="center">
        <span>
          {`${t('youCan')} `}
          <Link
            href="/my/subscriptions"
            sx={{ color: '#fff', textDecoration: 'underline' }}
          >
            {`${t('selectSubscriptions')} `}
          </Link>{' '}
          {`${t('youAreInterestedIn')}.`}
        </span>
      </Typography>
      <Box>
        <Formik
          enableReinitialize
          initialValues={{ email: '' }}
          validationSchema={email}
          //ToDo: add types to values
          onSubmit={(values: any, actions: FormikHelpers<Event>) => {}}
        >
          {({ isSubmitting, values, errors, setSubmitting, resetForm }) => {
            return (
              <Form>
                <Grid
                  container
                  component="fieldset"
                  sx={{
                    m: 0,
                    p: 0,
                    mb: 5,
                    '& > div': {
                      pb: 2,
                    },
                    '& > div:last-child': {
                      pb: 0,
                    },
                    border: 'none',
                  }}
                >
                  <Grid sx={{ mb: 4 }}>
                    <Field
                      component={TextFieldFormik}
                      label="Email"
                      color="secondary"
                      type="email"
                      fullWidth
                      name="email"
                      variant="outlined"
                      helperText={`*${t('form.yourEmail.helperText')}`}
                      disabled={isSubmitting}
                    />
                  </Grid>
                  <Grid display="flex" justifyContent="center">
                    <Button
                      variant="contained"
                      color="secondary"
                      type="submit"
                      disabled={isSubmitting || !!errors.email || !values.email}
                      onClick={async () => {
                        await handleTokenNotFound(values.email)
                          .then(() => {
                            resetForm()
                          })
                          .finally(() => {
                            setSubmitting(false)
                          })
                      }}
                    >
                      {t('form.submit')}
                      {isSubmitting && <ButtonSubmittingCircle />}
                    </Button>
                  </Grid>
                </Grid>
              </Form>
            )
          }}
        </Formik>
      </Box>
      <CustomSnackbar
        severity={severity}
        open={!!message}
        message={message}
        handleClose={() => {
          setMessage('')
        }}
      />
    </>
  )
}
