import { useRef, useState } from 'react'
import { css, useTheme } from '@mui/material/styles'
import { Container, Button, Typography } from '@mui/material'
import { Formik, Form, Field } from 'formik'
import ButtonSubmittingCircle from './ButtonSubmittingCircle'
import PlacesAutocomplete from './formInputs/PlacesAutocomplete'
import Snackbar from './Snackbars'
import ReCAPTCHA from 'react-google-recaptcha'
import { userLocationSchema } from '../../lib/validation'
import * as yup from 'yup'

export default function UserLocation(props) {
  const theme = useTheme()
  const [recaptcha, setRecaptcha] = useState(null)
  const [showRecaptcha, setShowRecaptcha] = useState(false)
  const recaptchaRef = useRef(null)
  const [backendError, setBackendError] = useState('')
  const loaded = useRef(false)
  const [geocoder, setGeocoder] = useState(null)

  const handleChange = (token) => {
    setRecaptcha(token)
  }

  const { setCenter, setLocationError } = props

  if (typeof window !== 'undefined' && window.google && !loaded.current) {
    setGeocoder(new google.maps.Geocoder())
    loaded.current = true
  }

  return (
    <Container
      sx={{
        maxWidth: 600,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        mt: 12,
      }}
    >
      <Typography align="center" component={'h1'} variant="h6" gutterBottom>
        Мы не смогли загрузить карту наличия вторсырья, поскольку не смогли
        определить местоположение
      </Typography>
      <Typography align="center" gutterBottom>
        Выберите, пожалуйста, населенный пункт вручную
      </Typography>
      <Formik<yup.InferType<typeof userLocationSchema>>
        enableReinitialize
        initialValues={{
          userLocation: null as any,
        }}
        validationSchema={userLocationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          setSubmitting(true)
          if (!showRecaptcha) {
            setShowRecaptcha(true)
            setSubmitting(false)
            return
          }

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
                response.results[0].geometry &&
                response.results[0].geometry.location
              ) {
                setCenter({
                  lng: response.results[0].geometry.location.lng(),
                  lat: response.results[0].geometry.location.lat(),
                })
                resetForm()
                setLocationError(false)
              } else {
                setBackendError(
                  'Не удалось получить координаты населенного пункта',
                )
              }
            })
            .finally(() => {
              if (recaptchaRef && recaptchaRef.current) {
                recaptchaRef.current.reset()
                setShowRecaptcha(false)
                setRecaptcha(null)
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

              <Button
                type="submit"
                variant="contained"
                sx={{ flexGrow: 0, margin: theme.spacing(3, 'auto', 2) }}
                disabled={isSubmitting}
              >
                Продолжить
                {isSubmitting && <ButtonSubmittingCircle />}
              </Button>
            </Form>
          )
        }}
      </Formik>
      <div
        style={{
          display: showRecaptcha ? 'flex' : 'none',
          justifyContent: 'center',
          margin: theme.spacing(2, 0),
        }}
      >
        <ReCAPTCHA
          ref={recaptchaRef}
          sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
          onChange={handleChange}
        />
      </div>
      {!!backendError && (
        <Snackbar
          severity="error"
          open={!!backendError}
          message={backendError}
          handleClose={() => {
            setBackendError('')
          }}
        />
      )}
    </Container>
  )
}
