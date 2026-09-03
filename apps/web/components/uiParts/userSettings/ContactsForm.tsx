import { useState, useEffect } from 'react'
import { Avatar, Button, Box, Typography } from '@mui/material'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import { Formik, Form, Field } from 'formik'
import TextFieldFormik from '../formInputs/TextFieldFormik'
import ButtonSubmittingCircle from '../ButtonSubmittingCircle'
import PageLoadingCircle from '../PageLoadingCircle'
import { enqueueSnackbar } from 'notistack'
import { userName as userNameValidator } from '@recycl/shared/dist/validation'
import * as yup from 'yup'
import { validateForm } from '../../../lib/helpers/errorHelpers'
import { useTranslations } from 'next-intl'

const api = '/api/my/account/user-name'

export default function ContactsForm() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [userName, setUserName] = useState('')
  const t = useTranslations('AccountSettings.ContactsForm')
  const tValidationMessages = useTranslations('ValidationMessages')

  const css = {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  }

  useEffect(() => {
    const userNameFetcher = async () => {
      try {
        setLoading(true)

        const response = await fetch(api)
        if (response.status !== 200) {
          throw new Error(t('errorMessage'))
        }

        const data = await response.json()

        setUserName(data.username)
      } catch (error) {
        setError(true)
      } finally {
        setLoading(false)
      }
    }
    userNameFetcher()
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
          {t('errorMessage')}
        </Typography>
      </Box>
    )
  }

  return (
    <Box>
      <Formik
        enableReinitialize
        initialValues={{
          username: userName,
        }}
        validate={async (values) => {
          return await validateForm({
            values,
            validationSchema: yup.object({
              username: userNameValidator,
            }),
            translations: tValidationMessages,
          })
        }}
        onSubmit={async (values) => {
          try {
            const response = await fetch(api, {
              method: 'PATCH',
              body: JSON.stringify(values),
              headers: {
                'Content-Type': 'application/json',
              },
            })

            if (response.status !== 200) {
              throw new Error(t('errorMessage'))
            }

            enqueueSnackbar(t('successMessage'), { variant: 'success' })
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
                  id="username"
                  label={t('userNameLabel')}
                  name="username"
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
