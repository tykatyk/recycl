import { useEffect, useState } from 'react'
import Snackbar from '../uiParts/Snackbars'
import SubscriptionForm from './SubscriptionForm'
import { Formik, FormikHelpers } from 'formik'
import { getNormalizedValues } from '../../lib/helpers/eventHelpers'
import { showErrorMessages } from '../../lib/helpers/errorHelpers'
import PageLoadingCircle from '../uiParts/PageLoadingCircle'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import { Box, Typography } from '@mui/material'
import type { Waste } from '../../lib/types/waste'
import Layout from '../layouts/Layout'
import { subscriptionVariantNames } from '@recycl/shared/dist/server/subscription'
import Link from '../uiParts/Link'
import { wasteAvailableSubscriptionSchema } from '../../lib/validation'
import * as yup from 'yup'

const createTitle =
  'Создание подписки на получение уведомлений о наличии вторсырья'
const updateTitle =
  'Редактирование подписки на получение уведомлений о наличии вторсырья'

const errorMessage = 'Возникла ошибка при сохранении заявки'

const createRoute = `/api/subscriptions/waste-available`
const updateRoute = (id: string) => `/api/subscriptions/waste-available/${id}`
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

  useSession({
    required: true,
    onUnauthenticated() {
      window.location.replace(
        '/auth/login?from=/my/subscriptions/waste-available/create',
      )
    },
  })

  useEffect(() => {
    const getUserSubscriptions = async () => {
      const response = await fetch('/api/subscriptions')

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
        setSeverity('error')
        setNotification('Ошибка сервера')
      }
    }

    loadData()
  }, [])

  useEffect(() => {
    const fetcher = async () => {
      if (!id) return

      const response = await fetch(`/api/subscriptions/waste-available/${id}`)

      if (!response.ok) throw new Error(errorMessage)

      const data = await response.json()
      setInitialValues(data)
    }

    fetcher()
  }, [id])

  const createHandler = async (
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

      router.push(indexRoute)
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
            onSubmit={createHandler}
          >
            <SubscriptionForm wasteTypes={wasteTypes} />
          </Formik>
        </Box>
      </>
    )
  }

  const NotSubscribed = () => {
    return (
      <Box
        sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      >
        <Typography paragraph align="center">
          У вас отключено получение уведомлений о наличии вторсырья.
        </Typography>
        <Typography paragraph align="center">
          Чтобы добавить подписку, включите уведомления, перейдя по ссылке:
        </Typography>
        <Typography>
          <Link href="/my/subscriptions">Управление подпиской</Link>
        </Typography>
      </Box>
    )
  }

  const renderContent = () => {
    switch (viewStatus) {
      case 'loading':
        return <PageLoadingCircle />
      case 'unsubscribed':
        return <NotSubscribed />
      case 'ok':
        return <CreateUpdateForm />
      default:
        return null
    }
  }

  return (
    <Layout title={action === 'create' ? createTitle : updateTitle}>
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
    </Layout>
  )
}
