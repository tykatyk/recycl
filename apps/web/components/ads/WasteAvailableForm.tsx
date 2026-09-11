import { useEffect, useState } from 'react'
import {
  Grid,
  Typography,
  Button,
  Box,
  MenuItem,
  TextField,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
} from '@mui/material'
import PageLoadingCircle from '../uiParts/PageLoadingCircle'
import ButtonSubmittingCircle from '../uiParts/ButtonSubmittingCircle'
import { useRouter } from 'next/router'
import { getNormalizedValues } from './removalFormConfig'
import { adSchema } from '../../lib/validation'
import { useSnackbar } from 'notistack'
import {
  userPhoneFetcher,
  wasteTypeFetcher,
} from '../../lib/helpers/dataFetcher'
import { useTranslations } from 'next-intl'
import { validateForm } from '../../lib/helpers/errorHelpers'
import * as yup from 'yup'
import type { Waste } from '../../lib/types/waste'
import { useFormik } from 'formik'
import PlacesAutocompleteNew from '../uiParts/formInputs/PlacesAutocompleteNew'
import NumberField from '../uiParts/formInputs/NumberField'

const api = '/api/my/ads'
const myAds = '/my/ads'

const initVal = {
  title: '',
  wasteLocation: null as any,
  wasteType: '' as any,
  quantity: null as any,
  contactPhone: '',
  comment: '',
}

type FormValues = yup.InferType<typeof adSchema>

export default function WasteAvailableForm(props) {
  const { h1 } = props
  const router = useRouter()
  const { locale } = router
  const { enqueueSnackbar } = useSnackbar()
  const [initialValues, setInitialValues] = useState<FormValues>(initVal)
  const [wasteTypesData, setWasteTypesData] = useState<Waste[]>([])
  const { id } = router.query
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const t = useTranslations('WasteAvailableForm')
  const tWasteTypes = useTranslations('WasteTypes')
  const tValidationMessages = useTranslations('ValidationMessages')

  const formik = useFormik({
    initialValues,

    validate: async (values) => {
      return await validateForm({
        values,
        validationSchema: adSchema,
        translations: tValidationMessages,
      })
    },

    onSubmit: async (values, { setSubmitting }) => {
      if (id) {
        await updateHandler(values, setSubmitting)
      } else {
        await createHandler(values, setSubmitting)
      }
    },
    enableReinitialize: true,
  })
  const shouldDisable = loading || formik.isSubmitting

  const createHandler = async (values: FormValues, setSubmitting) => {
    try {
      setSubmitting(true)
      const normalizedValues = getNormalizedValues(values)

      const response = await fetch(api, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          //  id,
          ...normalizedValues,
        }),
      })
      if (response.status !== 200) {
        enqueueSnackbar(t('unknownError'), { variant: 'error' })
        return
      }

      enqueueSnackbar(t('documentCreated'), { variant: 'success' })
      router.push(myAds, undefined, { locale })
    } catch (err) {
      enqueueSnackbar(t('unknownError'), {
        variant: 'error',
      })
    } finally {
      setSubmitting(false)
    }
  }

  const updateHandler = async (values: FormValues, setSubmitting) => {
    try {
      setSubmitting(true)
      const normalizedValues = getNormalizedValues(values)

      const response = await fetch(`${api}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          //  id,
          ...normalizedValues,
        }),
      })

      if (response.status !== 200) {
        enqueueSnackbar(t('unknownError'), { variant: 'error' })
        return
      }

      enqueueSnackbar(t('documentUpdated'), { variant: 'success' })
      router.back()
    } catch (err) {
      enqueueSnackbar(t('unknownError'), { variant: 'error' })
    } finally {
      setSubmitting(false)
    }
  }

  useEffect(() => {
    if (id) {
      const adFether = async () => {
        try {
          setLoading(true)

          const response = await fetch(`${api}/${id}`)
          if (response.status === 404) {
            router.push('/404', undefined, { locale })
          }

          const data = await response.json()
          if (!data) return router.push('/404', undefined, { locale })

          setInitialValues(data)
        } catch (error) {
          setError(true)
        } finally {
          setLoading(false)
        }
      }
      adFether()
    } else {
      const phoneFetcher = async () => {
        try {
          setLoading(true)

          const phoneData = await userPhoneFetcher()
          setInitialValues({
            ...initialValues,
            contactPhone: phoneData ? phoneData.phone : '',
          })
        } catch (error) {
          enqueueSnackbar(t('unknownError'), { variant: 'error' })
        } finally {
          setLoading(false)
        }
      }
      phoneFetcher()
    }
  }, [id])

  useEffect(() => {
    const dataFetcher = async () => {
      try {
        setLoading(true)

        const wasteTypesData = await wasteTypeFetcher()

        setWasteTypesData(wasteTypesData)
      } catch (error) {
        enqueueSnackbar(t('unknownError'), { variant: 'error' })
      } finally {
        setLoading(false)
      }
    }
    dataFetcher()
  }, [])

  if (error) return <Typography>{t('dataLoadingError')}</Typography>

  if (loading) return <PageLoadingCircle />

  return (
    <Box>
      <Box sx={{ mt: 2, mb: 3 }}>
        <Typography component="h1" variant="h4">
          {h1}
        </Typography>
      </Box>

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
          <Grid size={{ xs: 12 }}>
            <TextField
              id="title"
              name="title"
              variant="outlined"
              fullWidth
              label={t('form.adTitle')}
              helperText={
                (formik.touched.title && formik.errors.title) ||
                `*${t('form.adTitleHelperText')}`
              }
              disabled={shouldDisable}
              error={formik.touched.title && Boolean(formik.errors.title)}
              value={formik.values.title}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <PlacesAutocompleteNew
              id="wasteLocation"
              name="wasteLocation"
              variant="outlined"
              fullWidth
              label={t('form.wasteLocation')}
              value={formik.values.wasteLocation}
              onChange={(event, newValue) => {
                formik.setFieldValue('wasteLocation', newValue)
              }}
              onBlur={() => formik.setFieldTouched('wasteLocation', true)}
              error={
                formik.touched.wasteLocation &&
                Boolean(formik.errors.wasteLocation)
              }
              helperText={
                (formik.touched.wasteLocation && formik.errors.wasteLocation) ||
                `*${t('form.wasteLocationHelperText')}`
              }
              disabled={shouldDisable}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <FormControl
              fullWidth
              error={
                formik.touched.wasteType && Boolean(formik.errors.wasteType)
              }
            >
              <InputLabel id="wasteType-label">
                {t('form.wasteType')}
              </InputLabel>
              <Select
                id={'wasteType'}
                name={'wasteType'}
                color="secondary"
                variant="outlined"
                disabled={shouldDisable}
                value={formik.values.wasteType}
                onChange={(event) => {
                  const value = event.target.value
                  formik.setFieldValue('wasteType', value)
                }}
                onBlur={(event) => {
                  formik.setFieldTouched('wasteType', true)
                }}
                label={t('form.wasteType')}
                labelId="wasteType-label"
              >
                {wasteTypesData.map((item) => {
                  return (
                    <MenuItem key={item._id} value={item.name}>
                      {tWasteTypes(item.name)}
                    </MenuItem>
                  )
                })}
              </Select>
              <FormHelperText>
                {formik.touched.wasteType &&
                typeof formik.errors.wasteType === 'string'
                  ? formik.errors.wasteType
                  : ` *${t('form.wasteTypeHelperText')}`}
              </FormHelperText>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <NumberField
              disabled={shouldDisable}
              label={t('form.quantity')}
              id="quantity"
              name="quantity"
              value={formik.values.quantity}
              onValueChange={(value) => {
                formik.setFieldValue('quantity', value)

                if (!formik.touched.quantity) {
                  formik.setFieldTouched('quantity', true, false)
                }
              }}
              error={formik.touched.quantity && Boolean(formik.errors.quantity)}
              helperText={
                (formik.touched.quantity && formik.errors.quantity) ||
                `*${t('form.quantityHelperText')}`
              }
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              type="tel"
              id="contactPhone"
              name="contactPhone"
              variant="outlined"
              fullWidth
              label={t('form.phone')}
              helperText={
                (formik.touched.contactPhone && formik.errors.contactPhone) ||
                `*${t('form.phoneHelperText')}`
              }
              disabled={shouldDisable}
              error={
                formik.touched.contactPhone &&
                Boolean(formik.errors.contactPhone)
              }
              value={formik.values.contactPhone}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              multiline
              rows={5}
              label={t('form.comment')}
              fullWidth
              name="comment"
              id="comment"
              variant="outlined"
              disabled={shouldDisable}
              helperText={
                (formik.touched.comment && formik.errors.comment) ||
                `*${t('form.comment')}`
              }
              error={formik.touched.comment && Boolean(formik.errors.comment)}
              value={formik.values.comment}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
            />
          </Grid>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Button variant="contained" type="submit" disabled={shouldDisable}>
            {t('form.submit')}
            {formik.isSubmitting && <ButtonSubmittingCircle />}
          </Button>
        </Grid>
      </form>
    </Box>
  )
}
