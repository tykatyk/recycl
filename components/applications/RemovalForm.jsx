import { React, useEffect, useState } from 'react'
import {
  Grid,
  Typography,
  InputAdornment,
  Button,
  CircularProgress,
  useTheme,
} from '@material-ui/core'
import PlacesAutocomplete from '../uiParts/formInputs/PlacesAutocomplete.jsx'
import TextFieldFormik from '../uiParts/formInputs/TextFieldFormik.jsx'
import TextFieldDependantFormik from '../uiParts/formInputs/TextFieldDependantFormik.jsx'
import RemovalPopover from './RemovalPopover.jsx'
import SelectFormik from '../uiParts/formInputs/SelectFormik.jsx'
import Snackbar from '../uiParts/Snackbars.jsx'
import { CheckboxWithLabel } from 'formik-material-ui'
import { Formik, Form, Field } from 'formik'
import removalFormStyles from './removalFormStyles'
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
import { getInitialValues, getNormalizedValues } from './removalFormConfig.js'
import { removalApplicationSchema } from '../../lib/validation'

const useStyles = removalFormStyles
const initialValues = getInitialValues()
const fields = Object.keys(initialValues)

export default function RemovalForm(props) {
  const classes = useStyles()
  const theme = useTheme()
  const router = useRouter()
  const { data: session } = useSession()
  const { id: userId } = session
  const { id: applicationId } = router.query
  const [backendError, setBackendError] = useState(null)
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
        router.push('/removal/application')
      })
      .catch((err) => {
        setBackendError('Возникла ошибка при создании заявки')
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
      .then((data) => {})
      .catch((err) => {
        setBackendError('Возникла ошибка при сохранении заявки')
      })
      .finally(() => {
        setSubmitting(false)
      })
  }

  if (gettingError)
    return <Typography>Возникла ошибка при загрузке данных</Typography>

  if (gettingApplication || gettingWasteTypes) {
    return (
      <div
        style={{
          position: 'fixed',
          top: ' 50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <CircularProgress color="secondary" />
      </div>
    )
  }

  return (
    <>
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
        {({ isSubmitting, values, setFieldValue }) => {
          useEffect(() => {
            if (applicationId && !called)
              getRemovalApplication({ variables: { applicationId } })
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
          }, [applicationId, applicationData])

          useEffect(() => {
            if (
              !applicationId &&
              phoneData &&
              phoneData.getPhone &&
              phoneData.getPhone.phone
            ) {
              setFieldValue('contactPhone', phoneData.getPhone.phone, false)
            }
          }, [applicationId, phoneData])

          const shouldDisable =
            gettingApplication || gettingWasteTypes || isSubmitting

          return (
            <Form className={classes.formRoot}>
              <Grid
                item
                container
                component="fieldset"
                className={classes.gridContainer}
              >
                <Grid item xs={12} className={classes.sectionTitle}>
                  <Typography gutterBottom variant="h4">
                    Сдать отходы
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Field
                    id="wasteLocation"
                    name="wasteLocation"
                    variant="outlined"
                    fullWidth
                    component={PlacesAutocomplete}
                    label="Местоположение отходов"
                    helperText="*Обязательное поле"
                    disabled={shouldDisable}
                  />
                </Grid>
                <Grid item xs={12} className={classes.gridContainer}>
                  <SelectFormik
                    error={wasteTypesError}
                    loading={gettingWasteTypes}
                    data={
                      wasteTypesData ? wasteTypesData.getWasteTypes : undefined
                    }
                    name={'wasteType'}
                    label={'Тип отходов'}
                    helperText={'*Обязательное поле'}
                    disabled={shouldDisable}
                  />
                </Grid>
                <Grid item xs={12}>
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
                <Grid item xs={12}>
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
                <Grid item xs={12}>
                  <Field
                    component={CheckboxWithLabel}
                    type="checkbox"
                    name="passDocumet"
                    Label={{
                      label: 'Нужен документ о передаче отходов на переработку',
                    }}
                    disabled={shouldDisable}
                  />
                </Grid>
              </Grid>

              <Grid
                item
                container
                component="fieldset"
                className={classes.gridContainer}
              >
                <Grid item xs={12} className={classes.sectionTitle}>
                  <Typography gutterBottom variant="h4">
                    Параметры уведомлений
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Grid container>
                    <Grid item xs={11}>
                      <Field
                        component={CheckboxWithLabel}
                        type="checkbox"
                        name="notificationRadiusCheckbox"
                        Label={{
                          label:
                            'Получать уведомления о приеме отходов из заявки в радиусе:',
                        }}
                        disabled={shouldDisable}
                      ></Field>
                    </Grid>
                  </Grid>
                  <Grid container>
                    <Grid item xs={11}>
                      <Field
                        component={TextFieldDependantFormik}
                        data-master="notificationRadiusCheckbox"
                        disabled={
                          !values.notificationRadiusCheckbox || shouldDisable
                        }
                        name="notificationRadius"
                        variant="outlined"
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">Км</InputAdornment>
                          ),
                        }}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        fullWidth
                      />
                    </Grid>
                    <Grid
                      item
                      xs={1}
                      container
                      alignItems="center"
                      justifyContent="center"
                    >
                      <RemovalPopover id="notificationRadiusPopover">
                        <Typography
                          variant="body2"
                          style={{ maxWidth: '20em' }}
                        >
                          Выберите эту опцию если, например, в вашем населенном
                          пункте нет пунктов приема отходов указанных в заявке
                        </Typography>
                      </RemovalPopover>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <Grid container>
                    <Grid item xs={11}>
                      <Field
                        component={CheckboxWithLabel}
                        type="checkbox"
                        name="notificationCitiesCheckbox"
                        Label={{
                          label:
                            'Получать уведомления независимо от радиуса для следующих населенных пунктов:',
                        }}
                        disabled={shouldDisable}
                      />
                    </Grid>
                  </Grid>
                  <Grid container>
                    <Grid item xs={11}>
                      <Field
                        name="notificationCities"
                        data-master="notificationCitiesCheckbox"
                        variant="outlined"
                        multiple
                        component={PlacesAutocomplete}
                        disabled={
                          !values.notificationCitiesCheckbox || shouldDisable
                        }
                        fullWidth
                      />
                    </Grid>
                    <Grid
                      item
                      xs={1}
                      container
                      alignItems="center"
                      justifyContent="center"
                    >
                      <RemovalPopover id="notificationCitiesPopover">
                        <Typography
                          variant="body2"
                          style={{ maxWidth: '20em' }}
                        >
                          Выберите эту опцию если вы часто бываете в
                          определенных населенных пунктах и може сдать отходы
                          там
                        </Typography>
                      </RemovalPopover>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12} component="fieldset">
                <Button
                  variant="contained"
                  color="secondary"
                  type="submit"
                  disabled={shouldDisable}
                >
                  Сохранить
                  {isSubmitting && (
                    <CircularProgress
                      size={24}
                      style={{
                        color: theme.palette.secondary.main,
                        marginLeft: '1em',
                      }}
                    />
                  )}
                </Button>
              </Grid>
            </Form>
          )
        }}
      </Formik>
      <Snackbar
        severity="error"
        open={!!backendError}
        message={backendError}
        handleClose={() => {
          setBackendError(null)
        }}
      />
    </>
  )
}
