import { useEffect, useState } from 'react'
import { FormikHelpers, useFormik } from 'formik'
import { collectionPointSchema } from '../../lib/validation'
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
import { CollectionPointVariant } from '@recycl/shared/dist/constants'
import dayjs from 'dayjs'
import { wasteTypeFetcher } from '../../lib/helpers/dataFetcher'
import { useTranslations } from 'next-intl'
import { validateForm } from '../../lib/helpers/errorHelpers'
import { InferType } from 'yup'
import type { Waste } from '../../lib/types/waste'

const api = '/api/my/collection-points'

type CollectionPoint = InferType<typeof collectionPointSchema>

type CollectionPointFormProps = {
  variant: CollectionPointVariant
  h1: string
}
export default function CollectionPointFormUpdate(
  props: CollectionPointFormProps,
) {
  const { variant = 'container', h1 } = props
  const router = useRouter()
  const { locale } = router
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [wasteTypes, setWasteTypes] = useState<Waste[]>([])
  const { id } = router.query

  const { enqueueSnackbar } = useSnackbar()
  const t = useTranslations('CollectionPointFormUpdate')
  const tWasteTypes = useTranslations('WasteTypes')
  const tValidationMessages = useTranslations('ValidationMessages')

  const [initialValues, setInitialValues] = useState<CollectionPoint>(() => {
    const initVal = {
      location: null as any,
      wasteTypes: [],
      phone: '',
      comment: '',
      variant: 'container' as const,
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
      const response = await fetch(`${api}/${id}`)
      if (response.status === 404) {
        router.push('/404', undefined, { locale })
      }
      const collectionPoint = await response.json()

      const { location, wasteTypes, phone, comment, variant, date } =
        collectionPoint

      const initialValues = {
        location,
        wasteTypes,
        phone,
        comment,
        variant,
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
        const sorted = wasteTypeData.sort((a, b) =>
          tWasteTypes(a.name).localeCompare(tWasteTypes(b.name)),
        )
        setWasteTypes(sorted)
      } catch (error) {
        enqueueSnackbar(t('errorMessage'), { variant: 'error' })
      } finally {
        setLoading(false)
      }
    }
    dataFetcher()
  }, [id])

  const formik = useFormik({
    initialValues,
    validate: async (values) => {
      return await validateForm({
        values,
        validationSchema: collectionPointSchema,
        translations: tValidationMessages,
      })
    },
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
    fetch(`${api}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    })
      .then((response) => {
        return response.json()
      })
      .then((data) => {
        if (data.error) {
          enqueueSnackbar(t('errorMessage'), { variant: 'error' })
        } else if (data.message) {
          router.back()
        }
      })
      .catch((error) => {
        enqueueSnackbar(t('errorMessage'), { variant: 'error' })
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
