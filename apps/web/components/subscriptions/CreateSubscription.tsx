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
import type {
  Event,
  EventCreateUpdateProps,
  IsInactive,
} from '../../lib/types/event'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import { Box, Typography } from '@mui/material'
import type { Waste } from '../../lib/types/waste'
import { PlaceType } from '../../lib/types/placeAutocomplete'
import Layout from '../layouts/Layout'

type WasteAvailableSubscriptionConfig = {
  location: PlaceType | null
  wasteTypes: Waste[]
}

const title = 'Добавление подписки на получение уведомлений о наличии вторсирья'
const errorMessage = 'Возникла ошибка при сохранении заявки'
const api = '/api/events'
const createRoute = `${api}/create`
const updateRoute = (id: string) => `${api}/${id}`
const indexRoute = '/my/events'
const inactiveEventsRoute = '/my/events/inactive'

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
      window.location.replace('/auth/login?from=/my/subscriptions/create')
    },
  })

  const getWasteTypes = async () => {
    return await fetch('/api/waste-types')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Response is not OK')
        }
        return response.json()
      })
      .then((data: Waste[]) => {
        return data
      })
  }

  useEffect(() => {
    getWasteTypes()
      .then((wasteTypes) => {
        setWasteTypes(wasteTypes)
      })
      .catch((error) => {
        setSeverity('error')
        setNotification('Oшибка сервера')
      })
  }, [])

  //show error if no wasteTypes found
  if (!wasteTypes) return <ErrorComponent />

  //ToDo: refactor to helper function, since this handler can also be used for creating removalApplications
  const createHandler = (
    values: WasteAvailableSubscriptionConfig,
    {
      setSubmitting,
      setErrors,
      resetForm,
    }: FormikHelpers<WasteAvailableSubscriptionConfig>,
  ) => {
    setSubmitting(true)

    // const normalizedValues = getNormalizedValues(values)
    const normalizedValues = null

    fetch(createRoute, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(normalizedValues),
    })
      .then((response) => {
        return response.json()
      })
      .then((data) => {
        if (data.error) {
          setSeverity('error')
          showErrorMessages(data.error, setErrors, setNotification)
        } else if (data.message) {
          resetForm()
          router.push(indexRoute)
        }
      })
      .catch((error) => {
        setSeverity('error')
        setNotification(errorMessage)
      })
      .finally(() => {
        setSubmitting(false)
      })
  }

  return (
    <Layout title={title}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Typography
          component={'h1'}
          variant="h6"
          paragraph
          align="center"
          sx={{ mb: 3 }}
        >
          {title}
        </Typography>
        <Box sx={{ width: '100%' }}>
          <Formik
            enableReinitialize
            initialValues={{ location: null, wasteTypes: [] }}
            // validationSchema={eventSchema}
            onSubmit={(
              values: WasteAvailableSubscriptionConfig,
              actions: FormikHelpers<WasteAvailableSubscriptionConfig>,
            ) => {
              createHandler(values, actions)
            }}
          >
            <SubscriptionForm wasteTypes={wasteTypes} />
          </Formik>
        </Box>

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
