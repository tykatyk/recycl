import { useCallback, useEffect, useState } from 'react'
import { FormikHelpers, useFormik } from 'formik'
import { getNormalizedValues } from '../../lib/helpers/eventHelpers'
import { collectionPointSchema } from '../../lib/validation'
import type {
  CollectionPoint,
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
import { collectionPointTypes } from '@recycl/shared/dist/constants'

const errorMessage = 'Ошибка при сохранении документа'
const api = '/api/collection-points'
const indexRoute = '/my/collection-points'

export default function CollectionPointContainerForm() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [wasteTypes, setWasteTypes] = useState<any>([]) //ToDo: add type
  const [userPhone, setUserPhone] = useState<string>('')
  const { enqueueSnackbar } = useSnackbar()

  const createHandler = useCallback(
    (
      values: CollectionPoint,
      { setSubmitting, resetForm }: FormikHelpers<CollectionPoint>,
    ) => {
      setSubmitting(true)

      const normalizedValues = getNormalizedValues(values)

      fetch(api, {
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
    },
    [],
  )

  const formik = useFormik({
    initialValues: {
      user: '',
      location: null as any,
      wasteTypes: [],
      phone: userPhone || '',
      comment: '',
      variant: 'container' as const,
      viewCount: 0,
    },
    validationSchema: collectionPointSchema,
    onSubmit: (
      values: CollectionPointContainer,
      actions: FormikHelpers<CollectionPointContainer>,
    ) => {
      createHandler(values, actions)
    },
    enableReinitialize: true,
  })

  useEffect(() => {
    const wasteTypeFetcher = async () => {
      const result = await fetch(`/api/waste-types`)
      const data = await result.json()
      setWasteTypes(data)
    }
    const userPhoneFetcher = async () => {
      const result = await fetch(`/api/user/phone`)
      const data = await result.json()
      setUserPhone(data ? data.phone : '')
    }
    const dataFetcher = async () => {
      try {
        setLoading(true)
        await wasteTypeFetcher()
        await userPhoneFetcher()
      } catch (error) {
        enqueueSnackbar(errorMessage, { variant: 'error' })
      } finally {
        setLoading(false)
      }
    }
    dataFetcher()

    setMounted(true)
  }, [])

  if (!mounted) return null
  if (loading) return <PageLoadingCircle />

  return (
    <Box>
      <Typography component="h1" variant="h4" sx={{ mb: 4 }}>
        Добавить сортировочный контейнер для приема вторсырья
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
