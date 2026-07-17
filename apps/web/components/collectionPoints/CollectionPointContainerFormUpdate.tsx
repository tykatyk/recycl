import { useEffect, useState } from 'react'
import { FormikHelpers, useFormik } from 'formik'
import { collectionPointSchema } from '../../lib/validation'
import type {
  CollectionPointBase,
  CollectionPointContainer,
} from '../../lib/types/collectionPoint'
import { useRouter } from 'next/router'
import { Box, Grid, TextField, Typography } from '@mui/material'
import 'dayjs/locale/ru'
import {
  PhoneField,
  WasteTypeField,
  CommentField,
  SubmitButton,
  PlaceAutocompleteField,
} from '../uiParts/CollectionPointComponents'
import { useSnackbar } from 'notistack'
import PageLoadingCircle from '../uiParts/PageLoadingCircle'

const errorMessage = 'Возникла ошибка при сохранении заявки'
const api = '/api/collection-points'
const indexRoute = '/my/collection-points/container'

export default function CollectionPointContainerForm() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [wasteTypes, setWasteTypes] = useState<any>([]) //ToDo: add type
  const { id } = router.query

  const { enqueueSnackbar } = useSnackbar()
  const [initialValues, setInitialValues] = useState<CollectionPointContainer>({
    user: '',
    location: null as any,
    waste: [],
    phone: '',
    comment: '',
    variant: 'container' as const,
    viewCount: 0,
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!id) return

    const wasteTypeFetcher = async () => {
      const result = await fetch(`/api/waste-types`)
      const data = await result.json()
      setWasteTypes(data)
    }

    const collectionPointFetcher = async () => {
      const result = await fetch(`/api/collection-points/${id}`)
      const collectionPoint = await result.json()

      setInitialValues({
        user: collectionPoint.user,
        location: collectionPoint.location,
        waste: collectionPoint.waste,
        phone: collectionPoint.phone,
        comment: collectionPoint.comment,
        variant: collectionPoint.variant,
        viewCount: collectionPoint.viewCount,
      })
    }
    const dataFetcher = async () => {
      try {
        setLoading(true)
        await wasteTypeFetcher()
        await collectionPointFetcher()
      } catch (error) {
        enqueueSnackbar(errorMessage, { variant: 'error' })
      } finally {
        setLoading(false)
      }
    }
    dataFetcher()
  }, [id])

  const formik = useFormik({
    initialValues,
    validationSchema: collectionPointSchema,
    onSubmit: (
      values: CollectionPointContainer,
      actions: FormikHelpers<CollectionPointContainer>,
    ) => {
      updateHandler(values, actions)
    },
    enableReinitialize: true,
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null
  if (loading) return <PageLoadingCircle />

  const updateHandler = (
    values: CollectionPointBase,
    { setSubmitting }: FormikHelpers<CollectionPointBase>,
  ) => {
    setSubmitting(true)
    //delete user property from modifiedValues
    const { user, ...modifiedValues } = values
    fetch(`${api}/${id}`, {
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

  return (
    <Box>
      <Typography component="h1" variant="h4" sx={{ mb: 4 }}>
        Редактировать контейнер приема вторсырья
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
