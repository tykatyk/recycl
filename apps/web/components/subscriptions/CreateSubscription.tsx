import { useEffect, useState } from 'react'
import Snackbar from '../uiParts/Snackbars'
import ErrorComponent from '../uiParts/Error'
import SubscriptionForm from './SubscriptionForm'
import { Formik, FormikHelpers } from 'formik'
import {
  getInitialValues,
  getNormalizedValues,
} from '../../lib/helpers/eventHelpers'
import { eventSchema } from '../../lib/validation'
import { showErrorMessages } from '../../lib/helpers/errorHelpers'
import PageLoadingCircle from '../uiParts/PageLoadingCircle'
import type {
  Event,
  EventCreateUpdateProps,
  IsInactive,
} from '../../lib/types/event'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import { Box, IconButton, Tooltip, Typography } from '@mui/material'
import type { Waste } from '../../lib/types/waste'
import { PlaceType } from '../../lib/types/placeAutocomplete'
import Layout from '../layouts/Layout'
import HelpIcon from '@mui/icons-material/Help'
import { subscriptionVariantNames } from '@recycl/shared/dist/server/subscription'
import Link from '../uiParts/Link'
import { wasteAvailableSubscriptionSchema } from '../../lib/validation'
import * as yup from 'yup'

const title = 'Создание подписки на получение уведомлений о наличии вторсырья'
const errorMessage = 'Возникла ошибка при сохранении заявки'
const createRoute = `/api/subscriptions/waste-available`
const indexRoute = '/my/subscriptions/waste-available'

const SubscriptionDetails = () => {
  return (
    <Box
      sx={{
        p: 2,
        border: '1px dashed #ccc',
        borderRadius: '8px',
      }}
    >
      <Typography sx={{ fontWeight: 200, fontSize: '0.875rem', color: '#ccc' }}>
        {`Подписка предназначена для тех, кто занимается сбором вторсырья для дальнейшей переработки или утилизации. Она позволяет находить сырье, которое вам нужно, в местах, в которых вы работаете. Для добавления подписки укажите местоположение, относительно которого будет производится поиск, радиус поиска и один или несколько видов вторсырья. После добавления подписки, вы будете получать уведомления на электронную почту о новых объявлениях о наличии вторсырья.`}
      </Typography>
    </Box>
  )
}

export default function CreateSubscription() {
  const [severity, setSeverity] = useState<string>('success')
  const [wasteTypes, setWasteTypes] = useState<Waste[]>([])
  const router = useRouter()
  const { isInactive }: IsInactive = router.query
  const [notification, setNotification] = useState<string>('')
  // const initialValues = getInitialValues(event, userPhone)
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      window.location.replace(
        '/auth/login?from=/my/subscriptions/waste-available/create',
      )
    },
  })

  const [showDetails, setShowDetails] = useState(false)
  const [subscibed, setSubscribed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [viewStatus, setViewStatus] = useState('')

  useEffect(() => {
    const getActiveSubscriptions = async () => {
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
        const activeSubscriptions = await getActiveSubscriptions()

        console.log(activeSubscriptions)

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

  //show error if no wasteTypes found
  if (!wasteTypes) return <ErrorComponent />

  //ToDo: refactor to helper function, since this handler can also be used for creating removalApplications
  const createHandler = (
    values: yup.InferType<typeof wasteAvailableSubscriptionSchema>,
    {
      setSubmitting,
      setErrors,
      resetForm,
    }: FormikHelpers<yup.InferType<typeof wasteAvailableSubscriptionSchema>>,
  ) => {
    setSubmitting(true)

    const normalizedValues = getNormalizedValues(values)

    fetch(createRoute, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(normalizedValues),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(errorMessage)
        }
        resetForm()
        // router.push(indexRoute)
      })

      .catch((error) => {
        setSeverity('error')
        setNotification(errorMessage)
      })
      .finally(() => {
        setSubmitting(false)
      })
  }

  const CreationForm = () => {
    return (
      <>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            // justifyContent: 'center',
            // alignItems: 'center',
            mb: 2,
          }}
        >
          <Box sx={{ display: 'flex' }}>
            <Typography component={'h1'} variant="h6" align="center">
              {title}
            </Typography>
            <Box sx={{ pl: 2 }}>
              <Tooltip title="Подробнее об этой подписке">
                <IconButton
                  onClick={() => {
                    setShowDetails(!showDetails)
                  }}
                >
                  <HelpIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
          {showDetails ? <SubscriptionDetails /> : null}
        </Box>
        <Box sx={{ width: '100%' }}>
          <Formik<yup.InferType<typeof wasteAvailableSubscriptionSchema>>
            enableReinitialize
            initialValues={
              {
                location: null,
                wasteTypes: [],
                radius: '',
              } as any
            }
            validationSchema={wasteAvailableSubscriptionSchema}
            onSubmit={(
              values /*: WasteAvailableSubscriptionConfig*/,
              actions /*: FormikHelpers<WasteAvailableSubscriptionConfig>*/,
            ) => {
              createHandler(values, actions)
            }}
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
        return <CreationForm />
      default:
        return null
    }
  }

  return (
    <Layout title={title}>
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
