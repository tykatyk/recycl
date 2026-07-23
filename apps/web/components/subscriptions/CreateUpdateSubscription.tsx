import { useEffect, useState } from 'react'
import Snackbar from '../uiParts/Snackbars'
import SubscriptionForm from './SubscriptionForm'
import { Formik, FormikHelpers } from 'formik'
import { getNormalizedValues } from '../../lib/helpers/eventHelpers'
import { showErrorMessages } from '../../lib/helpers/errorHelpers'
import PageLoadingCircle from '../uiParts/PageLoadingCircle'
import { useRouter } from 'next/router'
import { Box, Button, Stack, Typography } from '@mui/material'
import type { Waste } from '../../lib/types/waste'
import Layout from '../layouts/Layout'
import { subscriptionVariantNames } from '@recycl/shared/dist/server/subscription'
import { default as ErrorComponent } from '../uiParts/Error'
import { wasteAvailableSubscriptionSchema } from '../../lib/validation'
import NotSubscribed from './NotSubscribed'
import * as yup from 'yup'
import RedirectUnathenticatedUser from '../uiParts/RedirectUnathenticatedUser'

const createTitle =
  'Создание подписки на получение уведомлений о наличии вторсырья'
const updateTitle =
  'Редактирование подписки на получение уведомлений о наличии вторсырья'

const errorMessage = 'Возникла ошибка при сохранении заявки'
const notSubscribedMessage =
  ' У вас отключены уведомления о появлении вторсырья.'

const createRoute = `/api/my/subscriptions/waste-available`
const updateRoute = (id: string) =>
  `/api/my/subscriptions/waste-available/${id}`
const indexRoute = '/my/subscriptions/waste-available'

export default function CreateSubscription(params: { action: string }) {
  const { action } = params
  const [severity, setSeverity] = useState<string>('success')
  const [wasteTypes, setWasteTypes] = useState<Waste[]>([])
  const router = useRouter()
  const [notification, setNotification] = useState<string>('')
  const [viewStatus, setViewStatus] = useState('')
  const [initialValues, setInitialValues] = useState({
    location: null,
    wasteTypes: [],
    radius: '',
  } as any)
  const { id = '' } = router.query

  useEffect(() => {
    const getUserSubscriptions = async () => {
      const response = await fetch(`/api/my/subscriptions`)

      if (!response.ok) {
        throw new Error('Response is not OK')
      }

      return (await response.json()) as (keyof typeof subscriptionVariantNames)[]
    }

    const getWasteTypes = async () => {
      const response = await fetch('/api/waste-types')

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
    const fetcher = async () => {
      if (!id) return

      const response = await fetch(
        `/api/my/subscriptions/waste-available/${id}`,
      )

      if (!response.ok) throw new Error(errorMessage)

      const data = await response.json()
      setInitialValues(data)
    }

    fetcher()
  }, [id])

  const formHandler = async (
    values: yup.InferType<typeof wasteAvailableSubscriptionSchema>,
    {
      setSubmitting,
      setErrors,
    }: FormikHelpers<yup.InferType<typeof wasteAvailableSubscriptionSchema>>,
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
        if (response.status === 422) {
          const data = await response.json()
          setSeverity('error')
          showErrorMessages(data.error, setErrors, setNotification)
          return
        }
        throw new Error(errorMessage)
      }

      action === 'create' ? router.push(indexRoute) : router.back()
    } catch (error) {
      setSeverity('error')
      setNotification(errorMessage)
    } finally {
      setSubmitting(false)
    }
  }

  const CreateUpdateForm = () => {
    return (
      <>
        <Box sx={{ mb: 2 }}>
          <Typography component={'h1'} variant="h6" align="center">
            {action === 'create' ? createTitle : updateTitle}
          </Typography>
        </Box>

        <Box sx={{ width: '100%' }}>
          <Formik<yup.InferType<typeof wasteAvailableSubscriptionSchema>>
            enableReinitialize
            initialValues={initialValues}
            validationSchema={wasteAvailableSubscriptionSchema}
            onSubmit={formHandler}
          >
            <SubscriptionForm wasteTypes={wasteTypes} />
          </Formik>
        </Box>
      </>
    )
  }

  const ErrorView = () => {
    return (
      <Stack spacing={3} sx={{ alignItems: 'center' }}>
        <ErrorComponent />
        <Box>
          <Button variant="outlined" color="secondary" href="/my/subscriptions">
            Вернуться
          </Button>
        </Box>
      </Stack>
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
        return <CreateUpdateForm />
      default:
        return null
    }
  }

  return (
    <Layout title={action === 'create' ? createTitle : updateTitle}>
      <RedirectUnathenticatedUser>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
          }}
        >
          {renderContent()}
          <Snackbar
            severity={severity}
            open={!!notification}
            message={notification}
            handleClose={() => {
              setNotification('')
            }}
          />
        </Box>
      </RedirectUnathenticatedUser>
    </Layout>
  )
}
