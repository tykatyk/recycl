import React, { useRef, useState } from 'react'
import {
  Container,
  Button,
  useTheme,
  makeStyles,
  Typography,
} from '@material-ui/core'
import { Formik, Form, Field } from 'formik'
import ButtonSubmittingCircle from './ButtonSubmittingCircle.jsx'
import PlacesAutocomplete from './formInputs/PlacesAutocomplete.jsx'
import Snackbar from './Snackbars.jsx'
import ReCAPTCHA from 'react-google-recaptcha'
import { userLocationSchema } from '../../lib/validation'

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 600,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: theme.spacing(12),
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  submit: {
    flexGrow: 0,
    margin: theme.spacing(3, 'auto', 2),
  },
}))

export default function UserLocation(props) {
  const theme = useTheme()
  const [recaptcha, setRecaptcha] = useState(null)
  const [showRecaptcha, setShowRecaptcha] = useState(false)
  const recaptchaRef = useRef(null)
  const [backendError, setBackendError] = useState(null)
  const loaded = useRef(false)
  const [geocoder, setGeocoder] = useState(null)

  const handleChange = (token) => {
    setRecaptcha(token)
  }

  const handleExpire = () => {
    setRecaptcha(null)
  }
  const classes = useStyles()
  const { setCenter, setLocationError } = props

  if (typeof window !== 'undefined' && window.google && !loaded.current) {
    setGeocoder(new google.maps.Geocoder())
    loaded.current = true
  }

  return (
    <Container className={classes.root}>
      <Typography align="center" paragraph>
        Для отображения карты, укажите пожалуйста населенный пункт в котором вы
        хотите сдать отходы
      </Typography>
      <Formik
        initialValues={{
          userLocation: '',
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
                let coords = {}
                coords.lng = response.results[0].geometry.location.lng()
                coords.lat = response.results[0].geometry.location.lat()

                setCenter(coords)
                resetForm()
                setLocationError(false)
              } else {
                setBackendError(
                  'Не удалось получить координаты населенного пункта'
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
            <Form className={classes.form} noValidate autoComplete="off">
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
                color="secondary"
                className={classes.submit}
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
          onExpired={handleExpire}
        />
      </div>
      {!!backendError && (
        <Snackbar
          severity="error"
          open={!!backendError}
          message={backendError}
          handleClose={() => {
            setBackendError(null)
          }}
        />
      )}
    </Container>
  )
}