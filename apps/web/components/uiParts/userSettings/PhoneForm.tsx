import { useState, useEffect } from 'react'
import { Avatar, Button, Box, Typography } from '@mui/material'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import { Formik, Form, Field } from 'formik'
// import Snackbar from '../Snackbars'
import TextFieldFormik from '../formInputs/TextFieldFormik'
import ButtonSubmittingCircle from '../ButtonSubmittingCircle'
import PageLoadingCircle from '../PageLoadingCircle'
import { phoneSchema } from '../../../lib/validation'
import { userPhoneFetcher } from '../../../lib/helpers/dataFetcher'
import { enqueueSnackbar } from 'notistack'

const errorMessage = 'Что то пошло не так'

export default function PhoneForm() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [phone, setPhone] = useState('')

  const css = {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  }

  useEffect(() => {
    const phoneFetcher = async () => {
      try {
        setLoading(true)
        const phoneData = await userPhoneFetcher()
        setPhone(phoneData ? phoneData.phone : '')
      } catch (error) {
        setError(true)
      } finally {
        setLoading(false)
      }
    }
    phoneFetcher()
  }, [])

  if (loading)
    return (
      <Box sx={css}>
        <PageLoadingCircle style={{ position: 'static' }} />
      </Box>
    )

  if (error) {
    return (
      <Box sx={css}>
        <Avatar
          sx={(theme) => ({
            margin: 1,
            backgroundColor: theme.palette.error.main,
          })}
        >
          <ErrorOutlineIcon />
        </Avatar>
        <Typography variant="body2" color="error">
          Ошибка при получении данных
        </Typography>
      </Box>
    )
  }

  return (
    <Box>
      <Formik
        enableReinitialize
        initialValues={{
          phone,
        }}
        validationSchema={phoneSchema}
        onSubmit={async (values) => {
          try {
            const response = await fetch('/api/my/account/phone', {
              method: 'PATCH',
              body: JSON.stringify(values),
              headers: {
                'Content-Type': 'application/json',
              },
            })

            if (response.status !== 200) {
              throw new Error(errorMessage)
            }

            enqueueSnackbar('Данные успешно обновлены', { variant: 'success' })
          } catch (error) {
            enqueueSnackbar('Возникла ошибка при сохранении данных', {
              variant: 'error',
            })
          }
        }}
      >
        {({ isSubmitting }) => {
          return (
            <Form noValidate autoComplete="off">
              <Box sx={{ mb: 2 }}>
                <Field
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  id="phone"
                  label="Номер телефона"
                  name="phone"
                  component={TextFieldFormik}
                />
              </Box>
              <Box>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={isSubmitting}
                  style={{ width: 'auto' }}
                >
                  Сохранить
                  {isSubmitting && <ButtonSubmittingCircle />}
                </Button>
              </Box>
            </Form>
          )
        }}
      </Formik>
    </Box>
  )
}
