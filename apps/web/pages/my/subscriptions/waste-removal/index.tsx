import { Box, Button, Stack, Typography } from '@mui/material'
import Layout from '../../../../components/layouts/Layout'
import { useFormik } from 'formik'
import { wasteRemovalSubscriptionSchema } from '../../../../lib/validation'
import * as yup from 'yup'
import { useEffect, useState } from 'react'
import ButtonSubmittingCircle from '../../../../components/uiParts/ButtonSubmittingCircle'
import { useSnackbar } from 'notistack'
import PageLoadingCircle from '../../../../components/uiParts/PageLoadingCircle'
import RedirectUnauthenticatedUser from '../../../../components/uiParts/RedirectUnauthenticatedUser'
import DataLoadingError from '../../../../components/uiParts/DataLoadingError'
import { subscriptionVariantNames } from '@recycl/shared/dist/server/subscription'
import NotSubscribed from '../../../../components/subscriptions/NotSubscribed'
import Head from 'next/head'
import { useTranslations } from 'next-intl'
import NumberField from '../../../../components/uiParts/formInputs/NumberField'
import { minRadius, maxRadius } from '@recycl/shared/dist/constants'
import { validateForm } from '../../../../lib/helpers/errorHelpers'
import CanonicalUrl from '../../../../components/uiParts/CanonicalUrl'
import { useRouter } from 'next/router'

const api = '/api/my/subscriptions'
const wasteRemovalApi = `${api}/waste-removal`
const frontendUrl = '/my/subscriptions'
const brand = process.env.NEXT_PUBLIC_BRAND || ''

const Content = ({ formik, t }) => {
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
        <form onSubmit={formik.handleSubmit}>
          <Stack
            spacing={3}
            sx={{ justifyContent: 'center', alignItems: 'center' }}
          >
            <Box sx={{ maxWidth: 250 }}>
              <NumberField
                min={minRadius}
                max={maxRadius}
                size="small"
                disabled={formik.isSubmitting}
                label={`${t('form.searchRadius.label')}`}
                id="radius"
                name="radius"
                value={formik.values.radius}
                onValueChange={(value) => {
                  formik.setFieldValue('radius', value)

                  if (!formik.touched.radius) {
                    formik.setFieldTouched('radius', true, false)
                  }
                }}
                error={formik.touched.radius && Boolean(formik.errors.radius)}
                helperText={formik.touched.radius && formik.errors.radius}
              />
            </Box>
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
                disabled={formik.isSubmitting}
                sx={{ ml: 1, mr: 1 }}
              >
                {t('form.submit')}
                {formik.isSubmitting && <ButtonSubmittingCircle />}
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
        </form>
      </Box>
    </>
  )
}

export default function WasteRemovalSubscription() {
  const [initialValues, setInitialValues] = useState({ radius: '' } as any)
  const [viewStatus, setViewStatus] = useState('')
  const { enqueueSnackbar } = useSnackbar()
  const router = useRouter()
  const { locale, locales, defaultLocale, asPath } = router
  const t = useTranslations('WasteRemovalSubscriptionPage')
  const tValidationMessages = useTranslations('ValidationMessages')

  const formik = useFormik<
    yup.InferType<typeof wasteRemovalSubscriptionSchema>
  >({
    enableReinitialize: true,
    initialValues: initialValues as any,
    validate: async (values) => {
      return await validateForm({
        values,
        validationSchema: wasteRemovalSubscriptionSchema,
        translations: tValidationMessages,
      })
    },

    onSubmit: async (values) => {
      await formHandler(values)
    },
  })

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
    const response = await fetch(`${wasteRemovalApi}`, {
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

  const renderContent = () => {
    switch (viewStatus) {
      case 'loading':
        return <PageLoadingCircle />

      case 'unsubscribed':
        return <NotSubscribed message={t('notSubscribed')} />

      case 'error':
        return <DataLoadingError />

      case 'ok':
        return <Content formik={formik} t={t} />

      default:
        return null
    }
  }

  return (
    <RedirectUnauthenticatedUser>
      <Head>
        <title>{`${t('title')} | ${brand}`}</title>
        <meta name="robots" content="noindex, nofollow"></meta>
        <CanonicalUrl
          asPath={asPath}
          locale={locale}
          defaultLocale={defaultLocale}
          locales={locales}
        />
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
    </RedirectUnauthenticatedUser>
  )
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      messages: (await import(`../../../../messages/${locale}.json`)).default,
    },
  }
}
