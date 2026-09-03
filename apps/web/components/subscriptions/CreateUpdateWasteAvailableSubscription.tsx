import { useEffect, useState } from 'react'
import SubscriptionForm from './WasteAvailableSubscriptionForm'
import { Formik, FormikHelpers } from 'formik'
import { getNormalizedValues } from '../../lib/helpers/eventHelpers'
import PageLoadingCircle from '../uiParts/PageLoadingCircle'
import { useRouter } from 'next/router'
import { Box, Typography } from '@mui/material'
import type { Waste } from '../../lib/types/waste'
import Layout from '../layouts/Layout'
import { subscriptionVariantNames } from '@recycl/shared/dist/server/subscription'
import DataLoadingError from '../uiParts/DataLoadingError'
import { wasteAvailableSubscriptionSchema } from '../../lib/validation'
import NotSubscribed from './NotSubscribed'
import Head from 'next/head'
import { enqueueSnackbar } from 'notistack'
import { useTranslations } from 'next-intl'
import { validateForm } from '../../lib/helpers/errorHelpers'
import { InferType } from 'yup'

const brand = process.env.NEXT_PUBLIC_BRAND || ''
const api = '/api/my/subscriptions'
const createRoute = `${api}/waste-available`
const updateRoute = (id: string) => `${api}/waste-available/${id}`
const indexRoute = '/my/subscriptions/waste-available'
const wasteTypesApi = '/api/waste-types'

type WasteAvailableSubscription = InferType<
  typeof wasteAvailableSubscriptionSchema
>

export default function CreateUpdateWasteAvailableSubscription(params: {
  action: 'create' | 'update'
}) {
  const { action } = params
  const [wasteTypes, setWasteTypes] = useState<Waste[]>([])
  const router = useRouter()
  const { locale } = router
  const [viewStatus, setViewStatus] = useState('')
  const [initialValues, setInitialValues] = useState({
    location: null,
    wasteTypes: [],
    radius: '',
  } as any)
  const { id = '' } = router.query
  const t = useTranslations('CreateUpdateWasteAvailableSubscription')
  const tValidationMessages = useTranslations('ValidationMessages')

  const title = action === 'create' ? t('createTitle') : t('updateTitle')

  useEffect(() => {
    const getUserSubscriptions = async () => {
      const response = await fetch(api)

      if (!response.ok) {
        throw new Error('Response is not OK')
      }

      return (await response.json()) as (keyof typeof subscriptionVariantNames)[]
    }

    const getWasteTypes = async () => {
      const response = await fetch(wasteTypesApi)

      if (!response.ok) {
        throw new Error('Response is not OK')
      }

      return (await response.json()) as Waste[]
    }

    const loadData = async () => {
      try {
        setViewStatus('loading')
        const activeSubscriptions = await getUserSubscriptions()

        if (
          !activeSubscriptions.includes(subscriptionVariantNames.wasteAvailable)
        ) {
          setViewStatus('unsubscribed')
          return
        }

        const wasteTypes = await getWasteTypes()

        setWasteTypes(wasteTypes)
        setViewStatus('ok')
      } catch (error) {
        setViewStatus('error')
      }
    }

    loadData()
  }, [])

  useEffect(() => {
    if (action !== 'update' || !id) return

    const fetcher = async () => {
      if (typeof id !== 'string') return

      const url = updateRoute(id)
      const response = await fetch(url)

      if (!response.ok) throw new Error(t('errorMessage'))

      const data = await response.json()
      setInitialValues(data)
    }

    fetcher()
  }, [id])

  const formHandler = async (
    values: WasteAvailableSubscription,
    { setSubmitting }: FormikHelpers<WasteAvailableSubscription>,
  ) => {
    let method = ''
    let route = ''

    switch (action) {
      case 'create':
        method = 'POST'
        route = createRoute
        break
      case 'update':
        method = 'PUT'
        route = updateRoute(String(id))
        break

      default:
        return
    }
    setSubmitting(true)

    const normalizedValues = getNormalizedValues(values)

    try {
      const response = await fetch(route, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(normalizedValues),
      })

      if (!response.ok) {
        throw new Error(t('errorMessage'))
      }

      action === 'create'
        ? router.push(indexRoute, undefined, { locale })
        : router.back()
    } catch (error) {
      enqueueSnackbar(t('errorMessage'), { variant: 'error' })
    } finally {
      setSubmitting(false)
    }
  }

  const CreateUpdateForm = () => {
    return (
      <>
        <Box sx={{ mt: 2, mb: 3 }}>
          <Typography component={'h1'} variant="h4" align="center">
            {action === 'create' ? t('createTitle') : t('updateTitle')}
          </Typography>
        </Box>

        <Box sx={{ width: '100%' }}>
          <Formik<WasteAvailableSubscription>
            enableReinitialize
            initialValues={initialValues}
            validate={async (values) => {
              return await validateForm({
                values,
                validationSchema: wasteAvailableSubscriptionSchema,
                translations: tValidationMessages,
              })
            }}
            onSubmit={formHandler}
          >
            <SubscriptionForm wasteTypes={wasteTypes} />
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
        return <CreateUpdateForm />
      default:
        return null
    }
  }

  return (
    <>
      <Head>
        <title>{`${title} | ${brand}`}</title>
        <meta name="robots" content="noindex, nofollow"></meta>
      </Head>
      <Layout>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
          }}
        >
          {renderContent()}
        </Box>
      </Layout>
    </>
  )
}
