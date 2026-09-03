import { useState, useEffect } from 'react'
import { Avatar, Button, Box, Typography } from '@mui/material'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import { Formik, Form, Field } from 'formik'
import TextFieldFormik from '../formInputs/TextFieldFormik'
import ButtonSubmittingCircle from '../ButtonSubmittingCircle'
import PageLoadingCircle from '../PageLoadingCircle'
import { userPhoneFetcher } from '../../../lib/helpers/dataFetcher'
import { enqueueSnackbar } from 'notistack'
import { phone as phoneValidator } from '@recycl/shared/dist/validation'
import * as yup from 'yup'
import { useTranslations } from 'next-intl'
import { validateForm } from '../../../lib/helpers/errorHelpers'

const api = '/api/my/account/phone'

export default function PhoneForm() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [phone, setPhone] = useState('')
  const t = useTranslations('AccountSettings.PhoneForm')
  const tValidationMessages = useTranslations('ValidationMessages')

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
          {t('dataFetchingError')}
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
        validate={async (values) => {
          return await validateForm({
            values,
            validationSchema: yup.object({ phone: phoneValidator }),
            translations: tValidationMessages,
          })
        }}
        onSubmit={async (values, { setErrors }) => {
          try {
            const response = await fetch(api, {
              method: 'PATCH',
              body: JSON.stringify(values),
              headers: {
                'Content-Type': 'application/json',
              },
            })

            if (response.status === 200) {
              enqueueSnackbar(t('successMessage'), {
                variant: 'success',
              })
              return
            }

            const data = await response.json()

            const { error } = data

            if (error.type === 'perField') {
              setErrors(error.message)
              return
            }
            if (error.type === 'perForm') {
              enqueueSnackbar(error.message, {
                variant: 'error',
              })
              return
            }
            throw new Error('Something went wrong')
          } catch (error) {
            enqueueSnackbar(t('errorMessage'), {
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
                  label={t('label')}
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
                  {t('submit')}
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
