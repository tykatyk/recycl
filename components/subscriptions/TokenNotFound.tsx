import { Typography, Box, Grid, Button, Alert } from '@mui/material'
import { Formik, FormikHelpers, Form, Field } from 'formik'
import { useEffect, useState } from 'react'
import { emailSchema } from '../../lib/validation'
import ButtonSubmittingCircle from '../uiParts/ButtonSubmittingCircle'
import TextFieldFormik from '../uiParts/formInputs/TextFieldFormik'
import CustomSnackbar from '../uiParts/Snackbars'
import Link from '../uiParts/Link'
import { unsubscribeApiResponseCodes } from '../../lib/helpers/subscriptions/unsubscribeApiResponseCodes'
import type { UnsubscribeApiResponse } from '../../lib/types/subscription'

const unsubscribeAPI = '/api/subscriptions/unsubscribe'
const errorMessge = 'Ошибка при получении данных'

const { SUCCESS, NOT_FOUND } = unsubscribeApiResponseCodes

export default function TokenNotFound() {
  const [message, setMessage] = useState<string>('')
  const [severity, setSeverity] = useState<string>('success')
  const [data, setData] = useState<UnsubscribeApiResponse | null>(null)

  const handleTokenNotFound = async (email: string) => {
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
        setMessage('Недействительный адрес электронной почты')
      } else if (response.status == 404) {
        setMessage('Пользователь с таким email не найден')
      } else {
        setMessage(errorMessge)
      }

      return
    }

    //ToDo: try catch
    const data = await response.json()

    setData(data)
  }

  useEffect(() => {
    if (!data) return

    switch (data.status) {
      case SUCCESS:
        setSeverity('success')
        setMessage('Письмо отправлено. Проверьте электронную почту')
        break

      case NOT_FOUND:
        setSeverity('success')
        setMessage('Этот email не подписан ни на одну рассылку')
        break

      default:
        setSeverity('success')
        setMessage('Этот email не подписан ни на одну рассылку')
        break
    }
  }, [data])

  return (
    <>
      <Typography variant="h4" component="h1" sx={{ mb: 4 }} align="center">
        Эта ссылка больше не действительна
      </Typography>
      <Typography sx={{ mb: 2 }} align="center">
        Для отписки от всех рассылок перейдите по ссылке из письма, которое мы
        вам отправим.
      </Typography>
      <Typography sx={{ mb: 2 }} align="center">
        <span>
          Вы также можете{' '}
          <Link
            href="/my/subscriptions"
            sx={{ color: '#fff', textDecoration: 'underline' }}
          >
            выбрать рассылки
          </Link>{' '}
          которые вам интересны.
        </span>
      </Typography>
      <Box>
        <Formik
          enableReinitialize
          initialValues={{ email: '' }}
          validationSchema={emailSchema}
          //ToDo: add types to values
          onSubmit={(values: any, actions: FormikHelpers<Event>) => {}}
        >
          {({ isSubmitting, values, errors, setSubmitting, resetForm }) => {
            return (
              <Form>
                <Grid
                  item
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
                  <Grid item xs={12} sx={{ mb: 4 }}>
                    <Field
                      component={TextFieldFormik}
                      label="Email"
                      color="secondary"
                      type="email"
                      fullWidth
                      name="email"
                      variant="outlined"
                      helperText="*Обязательное поле"
                      disabled={isSubmitting}
                    />
                  </Grid>
                  <Grid display="flex" justifyContent="center" item xs={12}>
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
                      Отправить
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
