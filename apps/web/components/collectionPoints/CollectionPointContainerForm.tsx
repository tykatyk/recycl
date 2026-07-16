import { useEffect, useState } from 'react'
import Error from '../uiParts/Error'
// import EventForm from './EventForm'
import { FormikHelpers, useFormik } from 'formik'
import {
  //   getInitialValues,
  getNormalizedValues,
} from '../../lib/helpers/eventHelpers'
import { collectionPointSchema } from '../../lib/validation'
// import { showErrorMessages } from '../../lib/helpers/errorHelpers'
import type {
  CollectionPoint,
  CollectionPointBase,
  CollectionPointContainer,
  CollectionPointContainerProps,
  EventCreateUpdateProps,
  IsInactive,
} from '../../lib/types/collectionPoint'
import { useRouter } from 'next/router'
import { Box, Grid, TextField, Typography } from '@mui/material'
// import { DateTime } from '../uiParts/formInputs/DateTime'
import 'dayjs/locale/ru'
import {
  PhoneField,
  WasteTypeField,
  CommentField,
  SubmitButton,
  PlaceAutocompleteField,
} from '../uiParts/CollectionPointComponents'
import { useSnackbar } from 'notistack'

const errorMessage = 'Возникла ошибка при сохранении заявки'
const api = '/api/collection-points'
const createRoute = `${api}/create`
const updateRoute = (id: string) => `${api}/${id}`
const indexRoute = '/my/collection-points/container'
const inactiveEventsRoute = '/my/collection-points/container/inactive'

export default function CollectionPointContainerForm(
  props: CollectionPointContainerProps,
) {
  const { userPhone, wasteTypes } = props
  const router = useRouter()
  const { isInactive }: IsInactive = router.query
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [collectionPoint, setCollectionPoint] = useState<
    (CollectionPointContainer & { _id: string }) | null
  >(null)

  const { enqueueSnackbar } = useSnackbar()
  const [initialValues, setInitialValues] = useState<CollectionPointContainer>({
    user: '',
    location: null as any,
    waste: [],
    phone: userPhone || '',
    comment: '',
    variant: 'container' as const,
    viewCount: 0,
  })

  const { id } = router.query

  useEffect(() => {
    if (!collectionPoint) return

    setInitialValues({
      user: collectionPoint.user,
      location: collectionPoint.location,
      waste: collectionPoint.waste,
      phone: collectionPoint.phone,
      comment: collectionPoint.comment,
      variant: collectionPoint.variant,
      viewCount: collectionPoint.viewCount,
    })
  }, [collectionPoint])

  useEffect(() => {
    if (!id) return

    const fetcher = async () => {
      try {
        setLoading(true)
        const result = await fetch(`/api/events/${id}`)
        const data = await result.json()

        setCollectionPoint(data)
      } catch (error) {
        enqueueSnackbar(errorMessage, { variant: 'error' })
      } finally {
        setLoading(false)
      }
    }
    fetcher()
  }, [id])

  //   const initialValues = getInitialValues(collectionPoint, userPhone)
  const formik = useFormik({
    initialValues,
    validationSchema: collectionPointSchema,
    onSubmit: (
      values: CollectionPointContainer,
      actions: FormikHelpers<CollectionPointContainer>,
    ) => {
      if (collectionPoint) {
        updateHandler(values, actions)
      } else {
        createHandler(values, actions)
      }
    },
    enableReinitialize: true,
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  //show error if no wasteTypes found
  if (!wasteTypes) return <Error />

  //ToDo: refactor to helper function, since this handler can also be used for creating removalApplications
  const createHandler = (
    values: CollectionPoint,
    { setSubmitting, resetForm }: FormikHelpers<CollectionPoint>,
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
          enqueueSnackbar(errorMessage, { variant: 'error' })
        } else if (data.message) {
          resetForm()
          router.push(indexRoute)
        }
      })
      .catch((error) => {
        enqueueSnackbar(errorMessage, { variant: 'error' })
      })
      .finally(() => {
        setSubmitting(false)
      })
  }

  const updateHandler = (
    values: CollectionPointBase,
    { setSubmitting, setErrors }: FormikHelpers<CollectionPointBase>,
  ) => {
    //though collectionPoint._id always exists in update handler
    //we check it anyway to narrow its type and prevent Typescript error
    if (!collectionPoint || !collectionPoint._id) return
    setSubmitting(true)
    //delete user property from modifiedValues
    const { user, ...modifiedValues } = values
    const searchParams = isInactive ? new URLSearchParams({ isInactive }) : ''
    fetch(`${updateRoute(collectionPoint._id)}?${searchParams}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        // _id: collectionPoint?._id,
        ...modifiedValues,
      }),
    })
      .then((response) => {
        return response.json()
      })
      .then((data) => {
        if (data.error) {
          enqueueSnackbar(errorMessage, { variant: 'error' })
        } else if (data.message) {
          isInactive
            ? router.push(inactiveEventsRoute)
            : router.push(indexRoute)
        }
      })
      .catch((error) => {
        enqueueSnackbar(errorMessage, { variant: 'error' })
      })
      .finally(() => {
        setSubmitting(false)
      })
  }
  // console.log(formik.errors)
  return (
    <Box>
      <Typography component="h1" variant="h4" sx={{ mb: 4 }}>
        Добавить контейнер приема вторсырья
      </Typography>

      <form onSubmit={formik.handleSubmit}>
        <Grid
          container
          maxWidth={'md'}
          sx={{
            '& > div': {
              pb: 3,
            },

            border: 'none',
          }}
        >
          <Grid size={{ xs: 12 }}>
            <TextField
              label="Тип пункта приема вторсырья"
              disabled={true}
              value={'Контейнер'}
              fullWidth
              name="collectionPointType"
              variant="outlined"
            />
          </Grid>
          <PlaceAutocompleteField
            collectionPointType={'container'}
            formik={formik}
          />
          <WasteTypeField wasteTypes={wasteTypes} formik={formik} />
          <PhoneField formik={formik} />
          <CommentField formik={formik} />
          <SubmitButton formik={formik} />
        </Grid>
      </form>
    </Box>
  )
}
