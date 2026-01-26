import { Typography, Box, Grid, Button } from '@mui/material'
import { Formik, FormikHelpers, Form, Field } from 'formik'
import { ReactElement, useState } from 'react'
import { emailSchema } from '../../lib/validation'
import ButtonSubmittingCircle from '../uiParts/ButtonSubmittingCircle'
import TextFieldFormik from '../uiParts/formInputs/TextFieldFormik'
import CustomSnackbar from '../uiParts/Snackbars'
import SuccessfullUnsubscribe from './SuccsesfulUnsubscribe'
import Link from '../uiParts/Link'

const unsubscribeAPI = '/api/subscriptions/unsubscribe'
const errorMessge = 'Ошибка при получении данных'

export default function TokenNotFound() {
  const [error, setError] = useState<string>('')
  const [data, setData] = useState<any>(null)
  let content: ReactElement | null = null

  const handleTokenNotFound = async (email: string) => {
    const response = await fetch(unsubscribeAPI, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ scope: 'email', data: email }),
    })
    if (!response.ok) {
      //ToDo: handle error
      setError(errorMessge)
    }
    const data = await response.json()
    //ToDo: handle success
    if (data.error) {
      setError(errorMessge)
    } else if (data.message === 'ok') {
      setData(data)
    }
  }

  switch (data?.message) {
    case 'ok':
      content = <SuccessfullUnsubscribe />
      return

    default:
      content = (
        <>
          <Typography variant="h4" component="h1" sx={{ mb: 4 }} align="center">
            Эта ссылка больше не действительна
          </Typography>
          <Typography sx={{ mb: 2 }} align="center">
            Для отписки от всех рассылок перейдите по ссылке из письма, которое
            мы вам отправим.
          </Typography>
          <Typography sx={{ mb: 2 }} align="center">
            <span>
              Или вы можете{' '}
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
              {({ isSubmitting, initialValues, values, setSubmitting }) => {
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
                          disabled={isSubmitting}
                          onClick={async () => {
                            await handleTokenNotFound(values.email)
                            setSubmitting(false)
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
            severity={'error'}
            open={!!error}
            message={error}
            handleClose={() => {
              setError('')
            }}
          />
        </>
      )
  }
  return content
}
