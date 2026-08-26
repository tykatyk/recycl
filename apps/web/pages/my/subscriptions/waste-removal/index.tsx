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
import DataLoadingError from '../../../../components/uiParts/DataLoadingError'
import { subscriptionVariantNames } from '@recycl/shared/dist/server/subscription'
import NotSubscribed from '../../../../components/subscriptions/NotSubscribed'
import Head from 'next/head'
import { useTranslations } from 'next-intl'

const api = '/api/my/subscriptions'
const wasteRemovalApi = `${api}/waste-removal`
const frontendUrl = '/my/subscriptions'
const brand = process.env.NEXT_PUBLIC_BRAND || ''

export default function WasteRemovalSubscription() {
  const [initialValues, setInitialValues] = useState({ radius: '' } as any)
  const [viewStatus, setViewStatus] = useState('')
  const { enqueueSnackbar } = useSnackbar()
  const t = useTranslations('WasteRemovalSubscriptionPage')

  useEffect(() => {
    const getUserSubscriptions = async () => {
      const response = await fetch(`${api}`)

      if (!response.ok) {
        throw new Error('Response is not OK')
      }

      return (await response.json()) as (keyof typeof subscriptionVariantNames)[]
    }

    const dataFetcher = async () => {
      const response = await fetch(`${wasteRemovalApi}`)

      if (!response.ok) {
        throw new Error(t('errorMessage'))
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
        enqueueSnackbar(t('errorMessage'), { variant: 'error' })
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
      enqueueSnackbar(t('errorMessage'), { variant: 'error' })
      return
    }

    enqueueSnackbar(t('successMessage'), { variant: 'success' })
  }

  const Content = () => {
    return (
      <>
        <Box sx={{ mt: 2, mb: 3 }}>
          <Typography
            component={'h1'}
            variant="h4"
            align="center"
            sx={{ mt: 2, mb: 3 }}
          >
            {t('h1')}
          </Typography>
        </Box>

        <Box sx={{ mb: 3, minWidth: 300 }}>
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
                      component={TextFieldFormik}
                      label={`${t('form.searchRadius.label')}`}
                      helperText={`*${t('form.searchRadius.helperText')}`}
                      type="number"
                      size="small"
                      sx={{ minWidth: 250 }}
                      inputProps={{ min: 1, max: 200 }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">{`${t('form.searchRadius.endAdornment')}`}</InputAdornment>
                        ),
                      }}
                      disabled={false}
                    />
                    <Box
                      sx={{
                        display: 'flex',
                        width: '100%',
                        justifyContent: 'center',
                      }}
                    >
                      <Button
                        variant="contained"
                        type="submit"
                        disabled={isSubmitting}
                        sx={{ ml: 1, mr: 1 }}
                      >
                        {t('form.submit')}
                        {isSubmitting && <ButtonSubmittingCircle />}
                      </Button>
                      <Button
                        variant="outlined"
                        color="secondary"
                        href={`${frontendUrl}`}
                        sx={{ ml: 1, mr: 1 }}
                      >
                        {t('backBtn')}
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
        return <NotSubscribed message={t('notSubscribed')} />
      case 'error':
        return <DataLoadingError />
      case 'ok':
        return <Content />
      default:
        return null
    }
  }

  return (
    <RedirectUnathenticatedUser>
      <Head>
        <title>{`${t('title')} | ${brand}`}</title>
        <meta name="robots" content="noindex, nofollow"></meta>
      </Head>
      <Layout>
        <Box
          sx={{
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {renderContent()}
        </Box>
      </Layout>
    </RedirectUnathenticatedUser>
  )
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      messages: (await import(`../../../../messages/${locale}.json`)).default,
    },
  }
}
