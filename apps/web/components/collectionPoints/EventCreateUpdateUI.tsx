import { useEffect, useState } from 'react'
import Snackbar from '../uiParts/Snackbars'
import Error from '../uiParts/Error'
// import EventForm from './EventForm'
import { FormikHelpers, useFormik } from 'formik'
import {
  getInitialValues,
  getNormalizedValues,
} from '../../lib/helpers/eventHelpers'
import { collectionPointSchema } from '../../lib/validation'
import { showErrorMessages } from '../../lib/helpers/errorHelpers'
import type {
  CollectionPoint,
  EventCreateUpdateProps,
  IsInactive,
} from '../../lib/types/collectionPoint'
import { useRouter } from 'next/router'
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import ButtonSubmittingCircle from '../uiParts/ButtonSubmittingCircle'
// import { DateTime } from '../uiParts/formInputs/DateTime'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import PlacesAutocompleteNew from '../uiParts/formInputs/PlacesAutocompleteNew'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import 'dayjs/locale/ru'

const errorMessage = 'Возникла ошибка при сохранении заявки'
const api = '/api/events'
const createRoute = `${api}/create`
const updateRoute = (id: string) => `${api}/${id}`
const indexRoute = '/my/events'
const inactiveEventsRoute = '/my/events/inactive'
const collectionPointTypes = {
  stationery: 'Стационарный',
  mobile: 'Передвижной',
  sortingContainer: 'Сортировочный контейнер',
} as const

function DateField({ formik }) {
  return (
    <Grid size={{ xs: 12 }}>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ru">
        <DateTimePicker
          name="date"
          slotProps={{
            textField: {
              id: 'date',
              variant: 'outlined',
              fullWidth: true,
              error: formik.touched.date && Boolean(formik.errors.date),
              helperText:
                (formik.touched.date && formik.errors.date) ||
                '*Обязательное поле',
              onBlur: () => formik.setFieldTouched('startDate', true),
            },
          }}
          label="Дата и время начала приема вторсырья"
          disabled={formik.isSubmitting}
          value={formik.values.date}
          onChange={(value) => {
            formik.setFieldValue('date', value)
          }}
          onAccept={() => {
            formik.setFieldTouched('date', true)
          }}
        />
      </LocalizationProvider>
    </Grid>
  )
}

function PhoneField({ formik }) {
  return (
    <Grid size={{ xs: 12 }}>
      <TextField
        label="Контактный телефон"
        color="secondary"
        type="tel"
        fullWidth
        name="phone"
        variant="outlined"
        helperText={
          (formik.touched.phone && formik.errors.phone) || '*Обязательное поле'
        }
        value={formik.values.phone}
        disabled={formik.isSubmitting}
        onBlur={formik.handleBlur}
        onChange={formik.handleChange}
      />
    </Grid>
  )
}

function PlaceAutocompleteField({ collectionPointType, formik }) {
  return (
    <Grid size={{ xs: 12 }}>
      <PlacesAutocompleteNew
        id="location"
        name="location"
        variant="outlined"
        fullWidth
        label={
          collectionPointType === 'mobile'
            ? 'Место приема вторсырья'
            : collectionPointType === 'sortingContainer'
              ? 'Местоположение сортировочного контейнера'
              : 'Местоположение пункта приема'
        }
        value={formik.values.location}
        onChange={(event, newValue) => {
          formik.setFieldValue('location', newValue)
        }}
        onBlur={() => formik.setFieldTouched('location', true)}
        error={formik.touched.location && Boolean(formik.errors.location)}
        helperText={
          (formik.touched.location && formik.errors.location) ||
          '*Обязательное поле'
        }
        disabled={formik.isSubmitting}
      />
    </Grid>
  )
}

function WasteTypeField({ wasteTypes, formik }) {
  return (
    <Grid size={{ xs: 12 }}>
      <FormControl fullWidth>
        <InputLabel id="waste-label">
          {'Типы принимаемого вторсырья'}
        </InputLabel>
        <Select
          id={'waste'}
          name={'waste'}
          multiple
          labelId="demo-simple-select-label"
          disabled={formik.isSubmitting}
          value={formik.values.waste}
          onChange={(event) => {
            const value = event.target.value
            formik.setFieldValue(
              'waste',
              typeof value === 'string' ? value.split(',') : value,
            )
          }}
          label={'Типы принимаемого вторсырья'}
        >
          {wasteTypes.map((item, index: number) => (
            <MenuItem key={index} value={item.name}>
              {item.name}
            </MenuItem>
          ))}
        </Select>
        <FormHelperText>
          {(formik.touched.waste && formik.errors.waste) ||
            '*Обязательное поле'}
        </FormHelperText>
      </FormControl>
    </Grid>
  )
}

function CommentField({ formik }) {
  return (
    <Grid size={{ xs: 12 }}>
      <TextField
        multiline
        rows={3}
        variant="outlined"
        fullWidth
        name="comment"
        id="comment"
        label="Описание"
        helperText={formik.touched.comment && formik.errors.comment}
        value={formik.values.comment}
        disabled={formik.isSubmitting}
        onBlur={formik.handleBlur}
        onChange={formik.handleChange}
      />
    </Grid>
  )
}

function SubmitButton({ formik }) {
  return (
    <Grid size={{ xs: 12 }}>
      <Button
        variant="contained"
        color="secondary"
        type="submit"
        disabled={formik.isSubmitting}
      >
        Сохранить
        {formik.isSubmitting && <ButtonSubmittingCircle />}
      </Button>
    </Grid>
  )
}

export default function EventCreateUpdateUI(props: EventCreateUpdateProps) {
  const { event: collectionPoint, userPhone, wasteTypes } = props
  const [severity, setSeverity] = useState<string>('success')
  const router = useRouter()
  const { isInactive }: IsInactive = router.query
  const [notification, setNotification] = useState<string>('')
  const [mounted, setMounted] = useState(false)

  const initialValues = getInitialValues(collectionPoint, userPhone)
  const formik = useFormik({
    initialValues,
    validationSchema: collectionPointSchema,
    onSubmit: (
      values: CollectionPoint,
      actions: FormikHelpers<CollectionPoint>,
    ) => {
      if (collectionPoint) {
        updateHandler(values, actions)
      } else {
        createHandler(values, actions)
      }
    },
    // enableReinitialize: true,
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  //show error if no wasteTypes found
  if (!wasteTypes) return <Error />

  //ToDo: refactor to helper function, since this handler can also be used for creating removalApplications
  const createHandler = (
    values: CollectionPoint,
    { setSubmitting, setErrors, resetForm }: FormikHelpers<CollectionPoint>,
  ) => {
    console.log(values)
    setSubmitting(true)

    const normalizedValues = getNormalizedValues(values)

    fetch(createRoute, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(normalizedValues),
    })
      .then((response) => {
        return response.json()
      })
      .then((data) => {
        if (data.error) {
          setSeverity('error')
          showErrorMessages(data.error, setErrors, setNotification)
        } else if (data.message) {
          resetForm()
          router.push(indexRoute)
        }
      })
      .catch((error) => {
        setSeverity('error')
        setNotification(errorMessage)
      })
      .finally(() => {
        setSubmitting(false)
      })
  }

  const updateHandler = (
    values: CollectionPoint,
    { setSubmitting, setErrors }: FormikHelpers<CollectionPoint>,
  ) => {
    //though collectionPoint._id always exists in update handler
    //we check it anyway to narrow its type and prevent Typescript error
    if (!collectionPoint || !collectionPoint._id) return
    setSubmitting(true)
    //delete user property from modifiedValues
    const { user, ...modifiedValues } = values
    const searchParams = isInactive ? new URLSearchParams({ isInactive }) : ''
    fetch(`${updateRoute(collectionPoint._id)}?${searchParams}`, {
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
          setSeverity('error')
          showErrorMessages(data.error, setErrors, setNotification)
        } else if (data.message) {
          isInactive
            ? router.push(inactiveEventsRoute)
            : router.push(indexRoute)
        }
      })
      .catch((error) => {
        setSeverity('error')
        setNotification(errorMessage)
      })
      .finally(() => {
        setSubmitting(false)
      })
  }

  return (
    <Box>
      <Typography component="h1" variant="h4" sx={{ mb: 4 }}>
        Добавить пункт приема вторсырья
      </Typography>

      <form>
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
          <Grid size={{ xs: 12 }}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">
                {'Тип пункта приема вторсырья'}
              </InputLabel>
              <Select
                name={'collectionPointType'}
                labelId="collection-point-type-label"
                id="collection-point-type"
                disabled={formik.isSubmitting}
                value={formik.values.collectionPointType}
                label={'Тип пункта приема вторсырья'}
                onChange={formik.handleChange}
              >
                {Object.keys(collectionPointTypes).map((key, index) => (
                  <MenuItem key={index} value={key}>
                    {collectionPointTypes[key]}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>*Обязательное поле</FormHelperText>
            </FormControl>
          </Grid>

          {formik.values.collectionPointType === 'mobile' && (
            <>
              <PlaceAutocompleteField
                formik={formik}
                collectionPointType={formik.values.collectionPointType}
              />
              <WasteTypeField wasteTypes={wasteTypes} formik={formik} />
              <DateField formik={formik} />
              <PhoneField formik={formik} />
              <CommentField formik={formik} />
              <SubmitButton formik={formik} />
            </>
          )}

          {formik.values.collectionPointType === 'stationery' && (
            <>
              <PlaceAutocompleteField
                collectionPointType={formik.values.collectionPointType}
                formik={formik}
              />
              <WasteTypeField wasteTypes={wasteTypes} formik={formik} />
              <PhoneField formik={formik} />
              <CommentField formik={formik} />
              <SubmitButton formik={formik} />
            </>
          )}

          {formik.values.collectionPointType === 'sortingContainer' && (
            <>
              <PlaceAutocompleteField
                collectionPointType={formik.values.collectionPointType}
                formik={formik}
              />
              <WasteTypeField wasteTypes={wasteTypes} formik={formik} />
              <CommentField formik={formik} />
              <SubmitButton formik={formik} />
            </>
          )}
        </Grid>
      </form>
      <Snackbar
        severity={severity}
        open={!!notification}
        message={notification}
        handleClose={() => {
          setNotification('')
        }}
      />
    </Box>
  )
}
