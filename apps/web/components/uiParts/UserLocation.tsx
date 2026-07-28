import { useMemo, useRef, useState } from 'react'
import { css } from '@mui/material/styles'
import { Container, Button, Typography, Box } from '@mui/material'
import { Formik, Form, Field } from 'formik'
import ButtonSubmittingCircle from './ButtonSubmittingCircle'
import PlacesAutocomplete from './formInputs/PlacesAutocomplete'
import ReCAPTCHA from 'react-google-recaptcha'
import { userLocationSchema } from '../../lib/validation'
import * as yup from 'yup'
import { useSnackbar } from 'notistack'
import { APIProvider, useMapsLibrary } from '@vis.gl/react-google-maps'

function UserLocationComponent(props) {
  const [recaptcha, setRecaptcha] = useState('')
  const recaptchaRef = useRef<ReCAPTCHA | null>(null)
  const { enqueueSnackbar } = useSnackbar()
  const geocodingLib = useMapsLibrary('geocoding')

  const handleChange = (token) => {
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
          Мы не смогли определить местоположение для отображения карты
        </Typography>
        <Typography align="center" gutterBottom>
          Выберите, пожалуйста, населенный пункт вручную
        </Typography>
      </Box>

      <Formik<yup.InferType<typeof userLocationSchema>>
        enableReinitialize
        initialValues={{
          userLocation: null as any,
        }}
        validationSchema={userLocationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
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
                enqueueSnackbar(
                  'Не удалось получить координаты населенного пункта',
                  { variant: 'error' },
                )
              }
            })
            .finally(() => {
              if (recaptchaRef && recaptchaRef.current) {
                recaptchaRef.current.reset()
                setRecaptcha('')
                setSubmitting(false)
              }
            })
        }}
      >
        {({ isSubmitting }) => {
          return (
            <Form
              css={css({
                width: '100%', // Fix IE 11 issue.
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              })}
            >
              <Box sx={{ mb: 2 }}>
                <Field
                  id="userLocation"
                  name="userLocation"
                  variant="outlined"
                  fullWidth
                  component={PlacesAutocomplete}
                  label="Населенный пункт"
                  helperText="*Обязательное поле"
                  disabled={isSubmitting}
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
                  disabled={isSubmitting}
                >
                  Продолжить
                  {isSubmitting && <ButtonSubmittingCircle />}
                </Button>
              </Box>
            </Form>
          )
        }}
      </Formik>
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
