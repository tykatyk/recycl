import { useEffect, useState } from 'react'
import { Grid, Typography, Button } from '@mui/material'
import PlacesAutocomplete from '../uiParts/formInputs/PlacesAutocomplete'
import TextFieldFormik from '../uiParts/formInputs/TextFieldFormik'
import SelectFormik from '../uiParts/formInputs/SelectFormik'
import Snackbar from '../uiParts/Snackbars'
import ButtonSubmittingCircle from '../uiParts/ButtonSubmittingCircle'
import PageLoadingCircle from '../uiParts/PageLoadingCircle'
import { Date } from '../uiParts/formInputs/Date'
import { Time } from '../uiParts/formInputs/Time'
import { Formik, Form, Field, useFormikContext, FormikHelpers } from 'formik'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import { useLazyQuery, useQuery } from '@apollo/client'
import { GET_REMOVAL_APPLICATION } from '../../lib/graphql/queries/removalApplication'
import { GET_WASTE_TYPES } from '../../lib/graphql/queries/wasteType'
import { GET_PHONE } from '../../lib/graphql/queries/user'
import { getInitialValues, getNormalizedValues } from './eventFormConfig'
import { eventSchema } from '../../lib/validation'
import showErrorMessages from '../../lib/helpers/showErrorMessages'
import 'dayjs/locale/ru'
import {
  EventId,
  EventValues,
  NormalizedEventValues,
} from '../../lib/types/event'
const initialValues = getInitialValues()
const fields = Object.keys(initialValues)
const errorMessage = 'Возникла ошибка при сохранении заявки'
export default function EventForm(props: EventId) {
  const router = useRouter()
  const { data: session } = useSession()
  const userId = session ? session.id : null
  const { id: applicationId } = router.query
  const [severity, setSeverity] = useState<string>('success')
  const {
    loading: gettingWasteTypes,
    data: wasteTypesData,
    error: wasteTypesError,
  } = useQuery(GET_WASTE_TYPES)
  const [notification, setNotification] = useState<string>('')

  const { data: phoneData } = useQuery(GET_PHONE, { variables: { id: userId } })

  const [
    getRemovalApplication,
    {
      called,
      loading: gettingApplication,
      data: applicationData,
      error: gettingError,
    },
  ] = useLazyQuery(GET_REMOVAL_APPLICATION)

  //ToDo: refactor to helper function, since this handler can also be used for creating removalApplications
  const createHandler = (
    values: EventValues,
    setSubmitting: FormikHelpers<EventValues>['setSubmitting'],
    setErrors: FormikHelpers<EventValues>['setErrors']
  ) => {
    setSubmitting(true)
    let normalizedValues: NormalizedEventValues
    try {
      normalizedValues = getNormalizedValues(values)
    } catch (e) {
      // console.log(e)
      setSeverity('error')
      setNotification(errorMessage)
      setSubmitting(false)
      return
    }
    fetch('/api/events', {
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
          setSeverity('success')
          setNotification(data.message)
        }
      })
      .catch((error) => {
        console.log(error)
        setNotification(errorMessage)
      })
      .finally(() => {
        setSubmitting(false)
      })
  }

  const updateHandler = (
    values: EventValues,
    setSubmitting: FormikHelpers<EventValues>['setSubmitting']
  ) => {
    setSubmitting(true)
    const normalizedValues = getNormalizedValues(values)
    // updateMutation({
    //   variables: { id: applicationId, newValues: normalizedValues },
    // })
    fetch('')
      .then((data) => {})
      .catch((err) => {
        setNotification(errorMessage)
      })
      .finally(() => {
        setSubmitting(false)
      })
  }

  if (gettingError)
    return <Typography>Возникла ошибка при загрузке данных</Typography>

  if (gettingApplication || gettingWasteTypes) {
    return <PageLoadingCircle />
  }

  const MyEventForm = () => {
    const { setFieldValue, isSubmitting, values, errors } =
      useFormikContext<EventValues>()
    const shouldDisable =
      gettingApplication || gettingWasteTypes || isSubmitting

    /* useEffect(() => {
      if (applicationId && !called)
        getRemovalApplication({ variables: { id: applicationId } })
      if (applicationData) {
        fields.forEach((field) => {
          if (field === 'wasteType') return
          setFieldValue(
            field,
            applicationData.getRemovalApplication[field],
            false
          )
        })
      }
    }, [setFieldValue])*/

    useEffect(() => {
      if (
        !applicationId &&
        phoneData &&
        phoneData.getPhone &&
        phoneData.getPhone.phone
      ) {
        setFieldValue('phone', phoneData.getPhone.phone, false)
      }
    }, [setFieldValue])
    return (
      <Form>
        <Grid
          item
          container
          component="fieldset"
          sx={{
            m: 0,
            p: 0,
            mb: 5,
            '& > div': {
              pb: 2,
            },
            '& > div:last-child': {
              pb: 0,
            },
            border: 'none',
          }}
        >
          <Grid item xs={12}>
            <Typography gutterBottom variant="h4" sx={{ marginBottom: 0 }}>
              Предложение о вывозе отходов
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Field
              id="location"
              name="location"
              variant="outlined"
              fullWidth
              component={PlacesAutocomplete}
              label="Населенный пункт"
              helperText="*Обязательное поле"
              disabled={shouldDisable}
            />
          </Grid>

          <Grid item xs={12}>
            <Field
              id="date"
              name="date"
              variant="outlined"
              fullWidth
              component={Date}
              label="Дата"
              helperText="*Обязательное поле"
              disabled={shouldDisable}
            />
          </Grid>

          <Grid item xs={12}>
            <Field
              id="startTime"
              name="startTime"
              variant="outlined"
              fullWidth
              component={Time}
              label="Время начала"
              disabled={shouldDisable}
            />
          </Grid>
          <Grid item xs={12}>
            <Field
              id="endTime"
              name="endTime"
              variant="outlined"
              fullWidth
              component={Time}
              label="Время завершения"
              disabled={shouldDisable}
            />
          </Grid>

          <Grid item xs={12}>
            <SelectFormik
              error={wasteTypesError}
              loading={gettingWasteTypes}
              data={wasteTypesData ? wasteTypesData.getWasteTypes : undefined}
              name={'wasteType'}
              label={'Тип отходов'}
              helperText={'*Обязательное поле'}
              disabled={shouldDisable}
            />
          </Grid>

          <Grid item xs={12}>
            <Field
              component={TextFieldFormik}
              label="Телефон"
              color="secondary"
              type="tel"
              fullWidth
              name="phone"
              variant="outlined"
              helperText="*Обязательное поле"
              disabled={shouldDisable}
            />
          </Grid>
          <Grid item xs={12}>
            <Field
              component={TextFieldFormik}
              multiline
              rows={3}
              variant="outlined"
              fullWidth
              name="comment"
              label="Примечание"
              disabled={shouldDisable}
            />
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Button
            variant="contained"
            color="secondary"
            type="submit"
            disabled={shouldDisable}
          >
            Сохранить
            {isSubmitting && <ButtonSubmittingCircle />}
          </Button>
        </Grid>
      </Form>
    )
  }

  return (
    <div>
      <Formik
        enableReinitialize
        initialValues={initialValues}
        // validationSchema={eventSchema}
        onSubmit={(values, { setSubmitting, setErrors }) => {
          if (applicationId) {
            updateHandler(values, setSubmitting)
          } else {
            createHandler(values, setSubmitting, setErrors)
          }
        }}
      >
        <MyEventForm />
      </Formik>
      <Snackbar
        severity={severity}
        open={!!notification}
        message={notification}
        handleClose={() => {
          setNotification('')
        }}
      />
    </div>
  )
}
