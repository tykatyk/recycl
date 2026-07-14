import { useEffect, useState } from 'react'
import Snackbar from '../uiParts/Snackbars'
import Error from '../uiParts/Error'
// import EventForm from './EventForm'
import { FormikHelpers, useFormik } from 'formik'
import {
  getInitialValues,
  getNormalizedValues,
} from '../../lib/helpers/eventHelpers'
import { eventSchema } from '../../lib/validation'
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
import Select from '@mui/material/Select'
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

export default function EventCreateUpdateUI(props: EventCreateUpdateProps) {
  const { event, userPhone, wasteTypes } = props
  const [severity, setSeverity] = useState<string>('success')
  const router = useRouter()
  const { isInactive }: IsInactive = router.query
  const [notification, setNotification] = useState<string>('')
  const [mounted, setMounted] = useState(false)

  const initialValues = getInitialValues(event, userPhone)
  const formik = useFormik({
    initialValues,
    validationSchema: eventSchema,
    onSubmit: (
      values: CollectionPoint,
      actions: FormikHelpers<CollectionPoint>,
    ) => {
      if (event) {
        updateHandler(values, actions)
      } else {
        createHandler(values, actions)
      }
    },
    enableReinitialize: true,
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
    //though event._id always exists in update handler
    //we check it anyway to narrow its type and prevent Typescript error
    if (!event || !event._id) return
    setSubmitting(true)
    //delete user property from modifiedValues
    const { user, ...modifiedValues } = values
    const searchParams = isInactive ? new URLSearchParams({ isInactive }) : ''
    fetch(`${updateRoute(event._id)}?${searchParams}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        // _id: event?._id,
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
  console.log(formik.values)
  function DateField() {
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

  function PhoneField() {
    return (
      <Grid size={{ xs: 12 }}>
        <TextField
          label="Контактный телефон"
          color="secondary"
          type="tel"
          fullWidth
          name="phone"
          variant="outlined"
          helperText="*Обязательное поле"
          disabled={formik.isSubmitting}
        />
      </Grid>
    )
  }

  function PlaceAutocompleteField({ collectionPointType }) {
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
          helperText="*Обязательное поле"
          disabled={formik.isSubmitting}
        />
      </Grid>
    )
  }

  function WasteTypeField({ wasteTypes }) {
    return (
      <Grid size={{ xs: 12 }}>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">
            {'Типы принимаемого вторсырья'}
          </InputLabel>
          <Select
            name={'waste'}
            multiple
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            // helperText={'*Обязательное поле'}
            disabled={formik.isSubmitting}
            value={formik.values.waste}
            onChange={formik.handleChange}
            label={'Типы принимаемого вторсырья'}
            renderValue={(selected) => selected.join(', ')}
          >
            {wasteTypes.map((item, index) => (
              <MenuItem key={index} value={item.name}>
                {item.name}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText>*Обязательное поле</FormHelperText>
        </FormControl>
      </Grid>
    )
  }

  function CommentField() {
    return (
      <Grid size={{ xs: 12 }}>
        <TextField
          multiline
          rows={3}
          variant="outlined"
          fullWidth
          name="comment"
          label="Описание"
          disabled={formik.isSubmitting}
        />
      </Grid>
    )
  }

  function SubmitButton() {
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
                collectionPointType={formik.values.collectionPointType}
              />
              <WasteTypeField wasteTypes={wasteTypes} />
              <DateField />
              <PhoneField />
              <CommentField />
              <SubmitButton />
            </>
          )}

          {formik.values.collectionPointType === 'stationery' && (
            <>
              <PlaceAutocompleteField
                collectionPointType={formik.values.collectionPointType}
              />
              <WasteTypeField wasteTypes={wasteTypes} />
              <PhoneField />
              <CommentField />
              <SubmitButton />
            </>
          )}

          {formik.values.collectionPointType === 'sortingContainer' && (
            <>
              <PlaceAutocompleteField
                collectionPointType={formik.values.collectionPointType}
              />
              <WasteTypeField wasteTypes={wasteTypes} />
              <CommentField />
              <SubmitButton />
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
