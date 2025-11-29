import { useState } from 'react'
import Snackbar from '../uiParts/Snackbars'
import Error from '../uiParts/Error'
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
import user from '../../lib/db/models/user'

const errorMessage = 'Возникла ошибка при сохранении заявки'
const api = '/api/events'
const createRoute = `${api}/create`
const updateRoute = (id: string) => `${api}/${id}`
const indexRoute = '/my/events'
const inactiveEventsRoute = '/my/events/inactive'

export default function CreateSubscription(props: EventCreateUpdateProps) {
  const { event, userPhone, wasteTypes } = props
  const [severity, setSeverity] = useState<string>('success')
  const router = useRouter()
  const { isInactive }: IsInactive = router.query
  const [notification, setNotification] = useState<string>('')
  const initialValues = getInitialValues(event, userPhone)
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      window.location.replace('/auth/login?from=/my/subscriptions/create')
    },
  })
  console.log(session)
  console.log(status)

  //show error if no wasteTypes found
  if (!wasteTypes) return <Error />

  //ToDo: refactor to helper function, since this handler can also be used for creating removalApplications
  const createHandler = (
    values: Event,
    { setSubmitting, setErrors, resetForm }: FormikHelpers<Event>,
  ) => {
    setSubmitting(true)

    const normalizedValues = getNormalizedValues(values)

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
    <Box>
      <Typography paragraph variant="h4">
        Объявление о вывозе отходов
      </Typography>
      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={eventSchema}
        onSubmit={(values: Event, actions: FormikHelpers<Event>) => {
          createHandler(values, actions)
        }}
      >
        <SubscriptionForm wasteTypes={wasteTypes} />
      </Formik>
      <Snackbar
        severity={severity}
        open={!!notification}
        message={notification}
        handleClose={() => {
          setNotification('')
        }}
      />
    </Box>
  )
}
