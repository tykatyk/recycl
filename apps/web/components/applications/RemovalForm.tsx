import { useEffect, useState } from 'react'
import { Grid, Typography, InputAdornment, Button, Box } from '@mui/material'
import PlacesAutocomplete from '../uiParts/formInputs/PlacesAutocomplete'
import TextFieldFormik from '../uiParts/formInputs/TextFieldFormik'
import SelectFormik from '../uiParts/formInputs/SelectFormik'
import PageLoadingCircle from '../uiParts/PageLoadingCircle'
import ButtonSubmittingCircle from '../uiParts/ButtonSubmittingCircle'
import { Formik, Form, Field, useFormikContext } from 'formik'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import { useMutation, useLazyQuery, useQuery } from '@apollo/client'
import {
  CREATE_REMOVAL_APPLICATION,
  GET_REMOVAL_APPLICATION,
  UPDATE_REMOVAL_APPLICATION,
} from '../../lib/graphql/queries/removalApplication'
import { GET_WASTE_TYPES } from '../../lib/graphql/queries/wasteType'
import { GET_PHONE } from '../../lib/graphql/queries/user'
import { initialValues, getNormalizedValues } from './removalFormConfig'
import { removalApplicationSchema } from '../../lib/validation'
import { useSnackbar } from 'notistack'

const fields = Object.keys(initialValues)

export default function RemovalForm() {
  const router = useRouter()
  const { data: session } = useSession()
  const { id: userId } = session
  const { id: applicationId } = router.query
  const { enqueueSnackbar } = useSnackbar()

  const {
    loading: gettingWasteTypes,
    data: wasteTypesData,
    error: wasteTypesError,
  } = useQuery(GET_WASTE_TYPES)

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

  const [createMutation] = useMutation(CREATE_REMOVAL_APPLICATION)
  const [updateMutation] = useMutation(UPDATE_REMOVAL_APPLICATION)

  const createHandler = (values, setSubmitting) => {
    setSubmitting(true)
    const normalizedValues = getNormalizedValues(values)
    createMutation({
      variables: { application: normalizedValues },
      fetchPolicy: 'no-cache',
    })
      .then((data) => {
        router.push('/my/applications')
      })
      .catch((error) => {
        enqueueSnackbar('Возникла ошибка при создании заявки', {
          variant: 'error',
        })
      })
      .finally(() => {
        setSubmitting(false)
      })
  }

  const updateHandler = (values, setSubmitting) => {
    setSubmitting(true)
    const normalizedValues = getNormalizedValues(values)
    updateMutation({
      variables: { id: applicationId, newValues: normalizedValues },
    })
      .then((data) => {
        router.push('/my/applications')
      })
      .catch((err) => {
        enqueueSnackbar('Возникла ошибка при сохранении заявки', {
          variant: 'error',
        })
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

  return (
    <Box>
      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={removalApplicationSchema}
        onSubmit={(values, { setSubmitting }) => {
          if (applicationId) {
            updateHandler(values, setSubmitting)
          } else {
            createHandler(values, setSubmitting)
          }
        }}
      >
        {({ setFieldValue, isSubmitting, values }) => {
          const shouldDisable =
            gettingApplication || gettingWasteTypes || isSubmitting

          useEffect(() => {
            if (applicationId && !called)
              getRemovalApplication({ variables: { id: applicationId } })
            if (applicationData) {
              if (applicationData.getRemovalApplication === null) {
                router.push('/404')
              } else {
                fields.forEach((field) => {
                  setFieldValue(
                    field,
                    applicationData.getRemovalApplication[field],
                    false,
                  )
                })
              }
            }
          }, [setFieldValue])

          useEffect(() => {
            if (
              !applicationId &&
              phoneData &&
              phoneData.getPhone &&
              phoneData.getPhone.phone
            ) {
              setFieldValue('contactPhone', phoneData.getPhone.phone, false)
            }
          }, [setFieldValue])

          return (
            <Form>
              <Grid
                container
                sx={{
                  mb: 2,
                  '& > div': {
                    pb: 2,
                  },
                  '& > div:last-child': {
                    pb: 0,
                  },
                }}
              >
                <Grid size={{ xs: 12 }}>
                  <Field
                    id="title"
                    name="title"
                    variant="outlined"
                    fullWidth
                    component={TextFieldFormik}
                    label="Заголовок объявления"
                    helperText="*Обязательное поле"
                    disabled={shouldDisable}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Field
                    id="wasteLocation"
                    name="wasteLocation"
                    variant="outlined"
                    fullWidth
                    component={PlacesAutocomplete}
                    label="Местоположение вторсырья"
                    helperText="*Обязательное поле"
                    disabled={shouldDisable}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <SelectFormik
                    error={wasteTypesError}
                    loading={gettingWasteTypes}
                    data={
                      wasteTypesData ? wasteTypesData.getWasteTypes : undefined
                    }
                    name={'wasteType'}
                    label={'Тип вторсырья'}
                    helperText={'*Обязательное поле'}
                    disabled={shouldDisable}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Field
                    component={TextFieldFormik}
                    label="Количество"
                    color="secondary"
                    type="number"
                    fullWidth
                    name="quantity"
                    variant="outlined"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">Кг</InputAdornment>
                      ),
                    }}
                    helperText="*Обязательное поле"
                    disabled={shouldDisable}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Field
                    component={TextFieldFormik}
                    label="Контактный телефон"
                    color="secondary"
                    type="tel"
                    fullWidth
                    name="contactPhone"
                    variant="outlined"
                    helperText="*Обязательное поле"
                    disabled={shouldDisable}
                  />
                </Grid>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Button
                  variant="contained"
                  type="submit"
                  disabled={shouldDisable}
                >
                  Сохранить
                  {isSubmitting && <ButtonSubmittingCircle />}
                </Button>
              </Grid>
            </Form>
          )
        }}
      </Formik>
    </Box>
  )
}
