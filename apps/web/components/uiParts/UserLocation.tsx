import { useMemo, useRef, useState } from 'react'
import { css } from '@mui/material/styles'
import { Container, Button, Typography, Box } from '@mui/material'
import ButtonSubmittingCircle from './ButtonSubmittingCircle'
import ReCAPTCHA from 'react-google-recaptcha'
import * as yup from 'yup'
import { useSnackbar } from 'notistack'
import { APIProvider, useMapsLibrary } from '@vis.gl/react-google-maps'
import { useTranslations } from 'use-intl'
import { location } from '@recycl/shared/dist/validation'
import { validateForm } from '../../lib/helpers/errorHelpers'
import { useFormik } from 'formik'
import PlacesAutocompleteNew from './formInputs/PlacesAutocompleteNew'

function UserLocationComponent(props) {
  const [recaptcha, setRecaptcha] = useState('')
  const recaptchaRef = useRef<ReCAPTCHA | null>(null)
  const { enqueueSnackbar } = useSnackbar()
  const geocodingLib = useMapsLibrary('geocoding')
  const t = useTranslations('UserLocationComponent')
  const tValidationMessages = useTranslations('ValidationMessages')

  const formik = useFormik<{ userLocation: yup.InferType<typeof location> }>({
    enableReinitialize: true,
    initialValues: {
      userLocation: null as any,
    },
    validate: async (values) => {
      return await validateForm({
        values,
        validationSchema: yup.object({
          userLocation: location,
        }),
        translations: tValidationMessages,
      })
    },
    onSubmit: (values, { setSubmitting, resetForm }) => {
      if (!recaptcha || !geocoder) {
        setSubmitting(false)
        return
      }

      geocoder
        .geocode({ placeId: values.userLocation['place_id'] })
        .then((response) => {
          if (
            response.results &&
            response.results.length > 0 &&
            response.results[0]?.geometry &&
            response.results[0].geometry.location
          ) {
            setCenter({
              lng: response.results[0].geometry.location.lng(),
              lat: response.results[0].geometry.location.lat(),
            })
            setLocationError(false)
            resetForm()
          } else {
            enqueueSnackbar(t('errorMessage'), { variant: 'error' })
          }
        })
        .finally(() => {
          if (recaptchaRef && recaptchaRef.current) {
            recaptchaRef.current.reset()
            setRecaptcha('')
            setSubmitting(false)
          }
        })
    },
  })

  const handleChange = (token: string) => {
    setRecaptcha(token)
  }

  const { setCenter, setLocationError } = props

  const geocoder = useMemo(
    () => geocodingLib && new geocodingLib.Geocoder(),
    [geocodingLib],
  )

  return (
    <Container
      maxWidth={'md'}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        alignItems: 'center',
        m: 'auto',
      }}
    >
      <Box sx={{ mb: 2 }}>
        <Typography align="center" component={'h1'} variant="h6" gutterBottom>
          {t('intro')}
        </Typography>
        <Typography align="center" gutterBottom>
          {t('selectLocation')}
        </Typography>
      </Box>

      <form
        onSubmit={formik.handleSubmit}
        css={css({
          width: '100%', // Fix IE 11 issue.
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        })}
      >
        <Box sx={{ mb: 2 }}>
          <PlacesAutocompleteNew
            id="userLocation"
            name="userLocation"
            variant="outlined"
            fullWidth
            label={t('form.userLocation.label')}
            value={formik.values.userLocation}
            onChange={(event, newValue) => {
              formik.setFieldValue('userLocation', newValue)
            }}
            onBlur={() => formik.setFieldTouched('userLocation', true)}
            error={
              formik.touched.userLocation && Boolean(formik.errors.userLocation)
            }
            helperText={
              (formik.touched.userLocation && formik.errors.userLocation) ||
              `*${t('form.userLocation.helperText')}`
            }
            disabled={formik.isSubmitting}
          />
        </Box>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            mb: 3,
          }}
        >
          <ReCAPTCHA
            ref={recaptchaRef}
            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
            onChange={handleChange}
          />
        </Box>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            mb: 3,
          }}
        >
          <Button
            type="submit"
            variant="contained"
            disabled={formik.isSubmitting}
          >
            {t('form.submit')}
            {formik.isSubmitting && <ButtonSubmittingCircle />}
          </Button>
        </Box>
      </form>
    </Container>
  )
}

export default function UserLocation(props) {
  const { setCenter, setLocationError } = props

  return (
    <APIProvider
      apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_BROWSER_KEY || ''}
      language="uk"
    >
      <UserLocationComponent
        setCenter={setCenter}
        setLocationError={setLocationError}
      />
    </APIProvider>
  )
}
