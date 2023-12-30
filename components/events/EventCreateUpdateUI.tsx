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
import type { Event, EventCreateUpdateProps } from '../../lib/types/event'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'

const errorMessage = 'Возникла ошибка при сохранении заявки'

export default function EventCreateUpdateUI(props: EventCreateUpdateProps) {
  const { event, userPhone } = props
  const [severity, setSeverity] = useState<string>('success')
  const router = useRouter()
  const [notification, setNotification] = useState<string>('')
  const initialValues = getInitialValues(event, userPhone)
  const { data: session } = useSession()

  //ToDo: refactor to helper function, since this handler can also be used for creating removalApplications
  const createHandler = (
    values: Event,
    { setSubmitting, setErrors, resetForm }: FormikHelpers<Event>,
  ) => {
    setSubmitting(true)

    const normailizedValues = getNormalizedValues(values)

    fetch('/api/events', {
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
          router.push('/my/events')
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
    setSubmitting(true)

    fetch('/api/events', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        _id: event?._id,
        isActive: true,
        ...values,
        user: event?.user,
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
          router.push('/my/events')
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
    <div>
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
    </div>
  )
}
