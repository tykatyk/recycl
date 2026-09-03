import { useCallback, useEffect, useState } from 'react'
import { FormikHelpers, useFormik } from 'formik'
import { getNormalizedValues } from '../../lib/helpers/eventHelpers'
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
import type { CollectionPointVariant } from '@recycl/shared/dist/constants'
import {
  wasteTypeFetcher,
  userPhoneFetcher,
} from '../../lib/helpers/dataFetcher'
import { useTranslations } from 'next-intl'
import { validateForm } from '../../lib/helpers/errorHelpers'
import { InferType } from 'yup'

const api = '/api/my/collection-points'
const indexRoute = '/my/collection-points'

type CollectionPoint = InferType<typeof collectionPointSchema>

type CollectionPointFormProps = {
  variant: CollectionPointVariant
  h1: string
}
export default function CollectionPointFormCreate(
  props: CollectionPointFormProps,
) {
  const { variant = 'container', h1 } = props
  const router = useRouter()
  const { locale } = router
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [wasteTypes, setWasteTypes] = useState<any>([]) //ToDo: add type
  const [userPhone, setUserPhone] = useState<string>('')
  const { enqueueSnackbar } = useSnackbar()
  const t = useTranslations('CollectionPointFormCreate')
  const tValidationMessages = useTranslations('ValidationMessages')

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
            enqueueSnackbar(t('errorMessage'), { variant: 'error' })
          } else if (data.message) {
            resetForm()
            const route =
              variant === 'mobile'
                ? `${indexRoute}/mobile`
                : variant === 'stationery'
                  ? `${indexRoute}/stationery`
                  : indexRoute
            router.push(route, undefined, { locale })
          }
        })
        .catch((error) => {
          enqueueSnackbar(t('errorMessage'), { variant: 'error' })
        })
        .finally(() => {
          setSubmitting(false)
        })
    },
    [],
  )

  const formik = useFormik<CollectionPoint>({
    initialValues:
      variant === 'mobile'
        ? {
            location: null as any,
            wasteTypes: [],
            phone: userPhone,
            comment: '',
            variant,
            date: null as any,
          }
        : {
            location: null as any,
            wasteTypes: [],
            phone: userPhone,
            comment: '',
            variant,
          },
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
      createHandler(values, actions)
    },
    enableReinitialize: true,
  })

  useEffect(() => {
    const dataFetcher = async () => {
      try {
        setLoading(true)
        const [wasteTypeData, phoneData] = await Promise.all([
          wasteTypeFetcher(),
          userPhoneFetcher(),
        ])

        setWasteTypes(wasteTypeData)
        setUserPhone(phoneData ? phoneData.phone : '')
      } catch (error) {
        enqueueSnackbar(t('errorMessage'), { variant: 'error' })
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
        {h1}
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
