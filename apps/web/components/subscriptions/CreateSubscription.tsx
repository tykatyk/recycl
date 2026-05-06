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
import { Box, IconButton, Tooltip, Typography } from '@mui/material'
import type { Waste } from '../../lib/types/waste'
import { PlaceType } from '../../lib/types/placeAutocomplete'
import Layout from '../layouts/Layout'
import HelpIcon from '@mui/icons-material/Help'
import * as yup from 'yup'
import { validation } from '@recycl/shared'

type WasteAvailableSubscriptionConfig = {
  location: PlaceType
  wasteTypes: Waste[]
  radius: number
}

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

  const wasteRemovalSubscriptionSchema = yup.object({
    location: validation.location,
    wasteTypes: yup
      .array()
      .of(yup.string())
      .min(1, (min) => `Выберите хотя бы ${min.min} элемент`),
    radius: yup
      .number()
      .required()
      .min(1, (min) => `Значение не должно быть меньше ${min.min}`)
      .max(200, (max) => `Значение не должно быть больше ${max.max}`),
  })

  useEffect(() => {
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

    const normalizedValues = getNormalizedValues(values)
    console.log(normalizedValues)

    fetch(createRoute, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(normalizedValues),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(errorMessage)
        }
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
        console.log(error)
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
          width: '100%',
        }}
      >
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
          <Formik
            enableReinitialize
            initialValues={{
              location: null,
              wasteTypes: [],
              radius: 0,
            }}
            validationSchema={wasteRemovalSubscriptionSchema}
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
