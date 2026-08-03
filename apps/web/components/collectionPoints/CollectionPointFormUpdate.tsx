import { useEffect, useState } from 'react'
import { FormikHelpers, useFormik } from 'formik'
import { collectionPointSchema } from '../../lib/validation'
import type { CollectionPoint } from '../../lib/types/collectionPoint'
import { useRouter } from 'next/router'
import { Box, Grid, Typography } from '@mui/material'
import 'dayjs/locale/ru'
import {
  PhoneField,
  WasteTypeField,
  CommentField,
  SubmitButton,
  PlaceAutocompleteField,
  DateField,
} from '../uiParts/CollectionPointComponents'
import { useSnackbar } from 'notistack'
import PageLoadingCircle from '../uiParts/PageLoadingCircle'
import { collectionPointTypes } from '@recycl/shared/dist/constants'
import dayjs from 'dayjs'
import { wasteTypeFetcher } from '../../lib/helpers/dataFetcher'

const errorMessage = 'Возникла ошибка при сохранении заявки'
const api = '/api/my/collection-points'

type CollectionPointFormProps = {
  variant: keyof typeof collectionPointTypes
  h1: string
}
export default function CollectionPointFormUpdate(
  props: CollectionPointFormProps,
) {
  const { variant = 'container', h1 } = props
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [wasteTypes, setWasteTypes] = useState<any>([]) //ToDo: add type
  const { id } = router.query

  const { enqueueSnackbar } = useSnackbar()

  const [initialValues, setInitialValues] = useState<CollectionPoint>(() => {
    const initVal = {
      user: '' as any,
      location: null as any,
      wasteTypes: [],
      phone: '',
      comment: '',
      variant: 'container' as const,
      viewCount: 0,
    }
    if (variant === 'mobile') {
      initVal['date'] = null
    }
    return initVal
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!id) return

    const collectionPointFetcher = async () => {
      const response = await fetch(`/api/my/collection-points/${id}`)
      if (response.status === 404) {
        router.push('/404')
      }
      const collectionPoint = await response.json()

      const {
        user,
        location,
        wasteTypes,
        phone,
        comment,
        variant,
        viewCount,
        date,
      } = collectionPoint

      const initialValues = {
        user,
        location,
        wasteTypes,
        phone,
        comment,
        variant,
        viewCount,
      }

      if (variant === 'mobile') {
        initialValues['date'] = dayjs(date)
      }

      setInitialValues(initialValues)
    }
    const dataFetcher = async () => {
      try {
        setLoading(true)
        const [wasteTypeData] = await Promise.all([
          wasteTypeFetcher(),
          collectionPointFetcher(),
        ])
        setWasteTypes(wasteTypeData)
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
      values: CollectionPoint,
      actions: FormikHelpers<CollectionPoint>,
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
    values: CollectionPoint,
    { setSubmitting }: FormikHelpers<CollectionPoint>,
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
          router.back()
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
        {h1}
      </Typography>

      <form onSubmit={formik.handleSubmit}>
        <Grid
          container
          maxWidth={'md'}
          sx={{
            '& > *': {
              mb: 3,
            },
          }}
        >
          <PlaceAutocompleteField
            collectionPointType={variant}
            formik={formik}
          />
          {variant === 'mobile' && <DateField formik={formik} />}
          <WasteTypeField wasteTypes={wasteTypes} formik={formik} />
          <PhoneField formik={formik} />
          <CommentField formik={formik} />
          <SubmitButton formik={formik} />
        </Grid>
      </form>
    </Box>
  )
}
