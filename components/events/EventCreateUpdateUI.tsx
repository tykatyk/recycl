import { useState } from 'react'
import Snackbar from '../uiParts/Snackbars'
import EventForm from './EventForm'
import { Formik, FormikHelpers } from 'formik'
import {
  getInitialValues,
  getNormalizedValues,
} from '../../lib/helpers/eventHelpers'
import { eventSchema } from '../../lib/validation'
import showErrorMessages from '../../lib/helpers/showErrorMessages'
import type {
  Event,
  EventCreateUpdateProps,
  IsInactive,
} from '../../lib/types/event'
import { useRouter } from 'next/router'
import { Box, Typography } from '@mui/material'

const errorMessage = 'Возникла ошибка при сохранении заявки'
const api = '/api/events'
const createRoute = `${api}/create`
const updateRoute = (id: string) => `${api}/${id}`
const indexRoute = '/my/events'
const inactiveEventsRoute = '/my/events/inactive'

export default function EventCreateUpdateUI(props: EventCreateUpdateProps) {
  const { event, userPhone } = props
  const [severity, setSeverity] = useState<string>('success')
  const router = useRouter()
  const { isInactive }: IsInactive = router.query
  const [notification, setNotification] = useState<string>('')
  const initialValues = getInitialValues(event, userPhone)

  //ToDo: refactor to helper function, since this handler can also be used for creating removalApplications
  const createHandler = (
    values: Event,
    { setSubmitting, setErrors, resetForm }: FormikHelpers<Event>,
  ) => {
    setSubmitting(true)

    const normailizedValues = getNormalizedValues(values)

    fetch(createRoute, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(normailizedValues),
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

  const updateHandler = (
    values: Event,
    { setSubmitting, setErrors }: FormikHelpers<Event>,
  ) => {
    //though event._id always exists in update handler
    //we check it anyway to narrow its type and prevent Typescript error
    if (!event || !event._id) return
    setSubmitting(true)
    //delete user property from modifiedValues
    const { user, ...modifiedValues } = values
    const searchParams = isInactive ? new URLSearchParams({ isInactive }) : ''
    fetch(`${updateRoute(event._id)}?${searchParams}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        // _id: event?._id,
        ...modifiedValues,
      }),
    })
      .then((response) => {
        return response.json()
      })
      .then((data) => {
        if (data.error) {
          setSeverity('error')
          showErrorMessages(data.error, setErrors, setNotification)
        } else if (data.message) {
          isInactive
            ? router.push(inactiveEventsRoute)
            : router.push(indexRoute)
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
          if (event) {
            updateHandler(values, actions)
          } else {
            createHandler(values, actions)
          }
        }}
      >
        <EventForm {...props} />
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
