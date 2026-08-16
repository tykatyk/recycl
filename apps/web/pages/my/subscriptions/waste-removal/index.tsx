import { Box, Button, InputAdornment, Stack, Typography } from '@mui/material'
import Layout from '../../../../components/layouts/Layout'
import { Formik, Form, Field } from 'formik'
import TextFieldFormik from '../../../../components/uiParts/formInputs/TextFieldFormik'
import { wasteRemovalSubscriptionSchema } from '../../../../lib/validation'
import * as yup from 'yup'
import { useEffect, useState } from 'react'
import ButtonSubmittingCircle from '../../../../components/uiParts/ButtonSubmittingCircle'
import { useSnackbar } from 'notistack'
import PageLoadingCircle from '../../../../components/uiParts/PageLoadingCircle'
import RedirectUnathenticatedUser from '../../../../components/uiParts/RedirectUnathenticatedUser'
import { default as ErrorComponent } from '../../../../components/uiParts/Error'
import { subscriptionVariantNames } from '@recycl/shared/dist/server/subscription'
import NotSubscribed from '../../../../components/subscriptions/NotSubscribed'
import Head from 'next/head'

const api = '/api/my/subscriptions/waste-removal'
const frontendUrl = '/my/subscriptions'

const brand = process.env.NEXT_PUBLIC_BRAND || ''
const title = `Указать радиус поиска пунктов приема вторсырья | ${brand}`

const errorMessage = 'Что то пошло не так'
const successMessage = 'Значение сохранено'
const notSubscribedMessage =
  'У вас отключены уведомления о появлении пунктов приема вторсырья'

const ErrorView = () => {
  return (
    <Stack spacing={3} sx={{ alignItems: 'center' }}>
      <ErrorComponent />
      <Box>
        <Button variant="outlined" color="secondary" href={`${frontendUrl}`}>
          Вернуться
        </Button>
      </Box>
    </Stack>
  )
}

const Content = () => {
  const [initialValues, setInitialValues] = useState({ radius: '' } as any)
  const [viewStatus, setViewStatus] = useState('')
  const { enqueueSnackbar } = useSnackbar()

  useEffect(() => {}, [])

  useEffect(() => {
    const getUserSubscriptions = async () => {
      const response = await fetch(`${api}`)

      if (!response.ok) {
        throw new Error('Response is not OK')
      }

      return (await response.json()) as (keyof typeof subscriptionVariantNames)[]
    }

    const dataFetcher = async () => {
      const response = await fetch(`${api}`)

      if (!response.ok) {
        throw new Error(errorMessage)
      }
      return await response.json()
    }

    const loadData = async () => {
      try {
        setViewStatus('loading')

        const activeSubscriptions = await getUserSubscriptions()

        if (
          !activeSubscriptions.includes(subscriptionVariantNames.wasteRemoval)
        ) {
          setViewStatus('unsubscribed')
          return
        }
        const data = await dataFetcher()
        setViewStatus('ok')

        if (!data) return
        setInitialValues({ radius: data.radius })
      } catch (error) {
        enqueueSnackbar(errorMessage, { variant: 'error' })

        setViewStatus('error')
      }
    }

    loadData()
  }, [])

  const formHandler = async (values) => {
    const response = await fetch(`${api}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ radius: values.radius }),
    })

    if (!response.ok) {
      enqueueSnackbar(errorMessage, { variant: 'error' })
      return
    }

    enqueueSnackbar(successMessage, { variant: 'success' })
  }

  const MainContent = () => {
    return (
      <>
        <Typography component={'h1'} variant="h6" sx={{ pb: 3 }} align="center">
          Укажите радиус поиска пунктов приема вторсырья из ваших обьявлений
        </Typography>
        <Box sx={{ pb: 3, minWidth: 300 }}>
          <Formik<yup.InferType<typeof wasteRemovalSubscriptionSchema>>
            enableReinitialize
            initialValues={initialValues as any}
            validationSchema={wasteRemovalSubscriptionSchema}
            onSubmit={(values) => {
              formHandler(values)
            }}
          >
            {({ isSubmitting }) => {
              return (
                <Form>
                  <Stack
                    spacing={3}
                    sx={{ justifyContent: 'center', alignItems: 'center' }}
                  >
                    <Field
                      id="radius"
                      name="radius"
                      variant="outlined"
                      fullWidth
                      component={TextFieldFormik}
                      label="Радиус поиска"
                      helperText="*Обязательное поле"
                      type="number"
                      size="small"
                      sx={{ width: '100%' }}
                      inputProps={{ min: 1, max: 200 }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">Км</InputAdornment>
                        ),
                      }}
                      disabled={false}
                    />
                    <Box
                      sx={{
                        display: 'flex',
                        width: '100%',
                        justifyContent: 'space-around',
                      }}
                    >
                      <Button
                        variant="contained"
                        type="submit"
                        disabled={isSubmitting}
                      >
                        Сохранить
                        {isSubmitting && <ButtonSubmittingCircle />}
                      </Button>
                      <Button
                        variant="outlined"
                        color="secondary"
                        href={`${frontendUrl}`}
                      >
                        Вернуться
                      </Button>
                    </Box>
                  </Stack>
                </Form>
              )
            }}
          </Formik>
        </Box>
      </>
    )
  }

  const renderContent = () => {
    switch (viewStatus) {
      case 'loading':
        return <PageLoadingCircle />
      case 'unsubscribed':
        return <NotSubscribed message={notSubscribedMessage} />
      case 'error':
        return <ErrorView />
      case 'ok':
        return <MainContent />
      default:
        return null
    }
  }

  return renderContent()
}

export default function WasteRemovalSubscriptionConfig() {
  return (
    <RedirectUnathenticatedUser>
      <Head>
        <title>{title}</title>
        <meta name="robots" content="noindex, nofollow"></meta>
      </Head>
      <Layout>
        <Box
          sx={{
            margin: 'auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Content />
        </Box>
      </Layout>
    </RedirectUnathenticatedUser>
  )
}
