import { useEffect, useState } from 'react'
import { FormikHelpers } from 'formik'
import { getNormalizedValues } from '../../lib/helpers/eventHelpers'
import PageLoadingCircle from '../uiParts/PageLoadingCircle'
import { useRouter } from 'next/router'
import {
  Box,
  Button,
  Chip,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from '@mui/material'
import type { Waste } from '../../lib/types/waste'
import Layout from '../layouts/Layout'
import { subscriptionVariantNames } from '@recycl/shared/dist/server/subscription'
import DataLoadingError from '../uiParts/DataLoadingError'
import { wasteAvailableSubscriptionSchema } from '../../lib/validation'
import NotSubscribed from './NotSubscribed'
import Head from 'next/head'
import { enqueueSnackbar } from 'notistack'
import { useTranslations } from 'next-intl'
import { validateForm } from '../../lib/helpers/errorHelpers'
import { InferType } from 'yup'
import CanonicalUrl from '../uiParts/CanonicalUrl'
import { wasteTypeFetcher } from '../../lib/helpers/dataFetcher'
import { useFormik } from 'formik'
import 'dayjs/locale/ru'
import ButtonSubmittingCircle from '../uiParts/ButtonSubmittingCircle'
import PlacesAutocompleteNew from '../uiParts/formInputs/PlacesAutocompleteNew'
import NumberField from '../uiParts/formInputs/NumberField'

const brand = process.env.NEXT_PUBLIC_BRAND || ''
const api = '/api/my/subscriptions'
const createRoute = `${api}/waste-available`
const updateRoute = (id: string) => `${api}/waste-available/${id}`
const indexRoute = '/my/subscriptions/waste-available'
const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8

type WasteAvailableSubscription = InferType<
  typeof wasteAvailableSubscriptionSchema
>

const CreateUpdateForm = ({ action, formik, wasteTypes }) => {
  const t = useTranslations('CreateUpdateWasteAvailableSubscription')
  const tWasteTypes = useTranslations('WasteTypes')

  return (
    <>
      <Box sx={{ mt: 2, mb: 3 }}>
        <Typography component={'h1'} variant="h4" align="center">
          {action === 'create' ? t('createTitle') : t('updateTitle')}
        </Typography>
      </Box>

      <Box sx={{ width: '100%' }}>
        <form onSubmit={formik.handleSubmit}>
          <Stack spacing={3}>
            <Box>
              <PlacesAutocompleteNew
                id="location"
                name="location"
                variant="outlined"
                fullWidth
                label={t('form.location.label')}
                value={formik.values.location}
                onChange={(event, newValue) => {
                  formik.setFieldValue('location', newValue)
                }}
                onBlur={() => formik.setFieldTouched('location', true)}
                error={
                  formik.touched.location && Boolean(formik.errors.location)
                }
                helperText={
                  (formik.touched.location && formik.errors.location) ||
                  `*${t('form.location.helperText')}`
                }
                disabled={formik.isSubmitting}
              />
            </Box>

            <Box>
              <NumberField
                disabled={formik.isSubmitting}
                label={t('form.searchRadius.label')}
                id="radius"
                name="radius"
                value={formik.values.radius}
                onValueChange={(value) => {
                  formik.setFieldValue('radius', value)

                  if (!formik.touched.radius) {
                    formik.setFieldTouched('radius', true, false)
                  }
                }}
                error={formik.touched.radius && Boolean(formik.errors.radius)}
                helperText={
                  (formik.touched.radius && formik.errors.radius) ||
                  `*${t('form.searchRadius.helperText')}`
                }
              />
            </Box>

            <Box>
              <FormControl
                fullWidth
                error={
                  formik.touched.wasteTypes && Boolean(formik.errors.wasteTypes)
                }
              >
                <InputLabel id="wasteTypes-label">
                  {t('form.wasteTypes.label')}
                </InputLabel>
                <Select
                  id={'wasteTypes'}
                  name={'wasteTypes'}
                  color="secondary"
                  variant="outlined"
                  fullWidth
                  multiple={true}
                  disabled={formik.isSubmitting}
                  value={formik.values.wasteTypes}
                  onChange={(event) => {
                    const value = event.target.value
                    formik.setFieldValue('wasteTypes', value)
                  }}
                  onBlur={(event) => {
                    formik.setFieldTouched('wasteTypes', true)
                  }}
                  label={t('form.wasteTypes.label')}
                  labelId="wasteTypes-label"
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={tWasteTypes(value)} />
                      ))}
                    </Box>
                  )}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                        width: 250,
                        borderRadius: 2,
                        boxShadow: 3,
                      },
                    },
                  }}
                >
                  {wasteTypes
                    .sort((a, b) =>
                      tWasteTypes(a.name).localeCompare(tWasteTypes(b.name)),
                    )
                    .map((item) => {
                      return (
                        <MenuItem
                          sx={{
                            '&.Mui-selected': {
                              background: '#2e3638',
                            },
                          }}
                          key={item._id}
                          value={item.name}
                        >
                          {tWasteTypes(item.name)}
                        </MenuItem>
                      )
                    })}
                </Select>
                <FormHelperText>
                  {formik.touched.wasteTypes &&
                  typeof formik.errors.wasteTypes === 'string'
                    ? formik.errors.wasteTypes
                    : ` *${t('form.wasteTypes.helperText')}`}
                </FormHelperText>
              </FormControl>
            </Box>
            <Box>
              <Button
                variant="contained"
                type="submit"
                disabled={formik.isSubmitting}
              >
                {t('form.submit')}
                {formik.isSubmitting && <ButtonSubmittingCircle />}
              </Button>
            </Box>
          </Stack>
        </form>
      </Box>
    </>
  )
}

export default function CreateUpdateWasteAvailableSubscription(params: {
  action: 'create' | 'update'
}) {
  const { action } = params
  const [wasteTypes, setWasteTypes] = useState<Waste[]>([])
  const router = useRouter()
  const { locale, locales, defaultLocale, asPath, query } = router
  const { id = '' } = query
  const [viewStatus, setViewStatus] = useState('')
  const [initialValues, setInitialValues] = useState({
    location: null,
    wasteTypes: [],
    radius: null,
  } as any)

  const t = useTranslations('CreateUpdateWasteAvailableSubscription')
  const tWasteTypes = useTranslations('WasteTypes')
  const tValidationMessages = useTranslations('ValidationMessages')

  const title = action === 'create' ? t('createTitle') : t('updateTitle')

  useEffect(() => {
    const getUserSubscriptions = async () => {
      const response = await fetch(api)

      if (!response.ok) {
        throw new Error('Response is not OK')
      }

      return (await response.json()) as (keyof typeof subscriptionVariantNames)[]
    }

    const loadData = async () => {
      try {
        setViewStatus('loading')
        const activeSubscriptions = await getUserSubscriptions()

        if (
          !activeSubscriptions.includes(subscriptionVariantNames.wasteAvailable)
        ) {
          setViewStatus('unsubscribed')
          return
        }

        const wasteTypes = await wasteTypeFetcher()

        setWasteTypes(wasteTypes)
        setViewStatus('ok')
      } catch (error) {
        setViewStatus('error')
      }
    }

    loadData()
  }, [])

  useEffect(() => {
    if (action !== 'update' || !id) return

    const fetcher = async () => {
      if (typeof id !== 'string') return

      const url = updateRoute(id)
      const response = await fetch(url)

      if (!response.ok) throw new Error(t('errorMessage'))

      const data = await response.json()
      setInitialValues(data)
    }

    fetcher()
  }, [id])

  const formHandler = async (
    values: WasteAvailableSubscription,
    { setSubmitting }: FormikHelpers<WasteAvailableSubscription>,
  ) => {
    let method = ''
    let route = ''

    switch (action) {
      case 'create':
        method = 'POST'
        route = createRoute
        break
      case 'update':
        method = 'PUT'
        route = updateRoute(String(id))
        break

      default:
        return
    }
    setSubmitting(true)

    const normalizedValues = getNormalizedValues(values)

    try {
      const response = await fetch(route, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(normalizedValues),
      })

      if (!response.ok) {
        throw new Error(t('errorMessage'))
      }

      action === 'create'
        ? router.push(indexRoute, undefined, { locale })
        : router.back()
    } catch (error) {
      enqueueSnackbar(t('errorMessage'), { variant: 'error' })
    } finally {
      setSubmitting(false)
    }
  }

  const formik = useFormik<WasteAvailableSubscription>({
    enableReinitialize: true,
    initialValues,
    validate: async (values) => {
      return await validateForm({
        values,
        validationSchema: wasteAvailableSubscriptionSchema,
        translations: tValidationMessages,
      })
    },
    onSubmit: formHandler,
  })

  const renderContent = () => {
    switch (viewStatus) {
      case 'loading':
        return <PageLoadingCircle />
      case 'unsubscribed':
        return <NotSubscribed message={t('notSubscribed')} />
      case 'error':
        return <DataLoadingError />
      case 'ok':
        return (
          <CreateUpdateForm
            action={action}
            formik={formik}
            wasteTypes={wasteTypes}
          />
        )
      default:
        return null
    }
  }

  return (
    <>
      <Head>
        <title>{`${title} | ${brand}`}</title>
        <meta name="robots" content="noindex, nofollow"></meta>
        <CanonicalUrl
          asPath={asPath}
          locale={locale}
          defaultLocale={defaultLocale}
          locales={locales}
        />
      </Head>
      <Layout>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
          }}
        >
          {renderContent()}
        </Box>
      </Layout>
    </>
  )
}
