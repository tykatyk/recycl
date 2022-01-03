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
import SendMessage from '../uiParts/SendMessage.jsx'
import Snackbar from '../uiParts/Snackbars.jsx'
import { CheckboxWithLabel } from 'formik-material-ui'
import { Formik, Form, Field } from 'formik'
import removalFormStyles from './removalFormStyles'
import { useRouter } from 'next/router'
import { useMutation, useLazyQuery, useQuery } from '@apollo/client'
import {
  CREATE_REMOVAL_APPLICATION,
  GET_REMOVAL_APPLICATION,
  UPDATE_REMOVAL_APPLICATION,
} from '../../lib/graphql/queries/removalApplication'
import { GET_WASTE_TYPES } from '../../lib/graphql/queries/wasteType'
import { getInitialValues, getNormalizedValues } from './removalFormConfig.js'
import { removalApplicationSchema } from '../../lib/validation'

const useStyles = removalFormStyles
const initialValues = getInitialValues()
const fields = Object.keys(initialValues)

export default function RemovalForm(props) {
  const classes = useStyles()
  const theme = useTheme()
  const router = useRouter()
  const { id } = router.query
  const [backendError, setBackendError] = useState(null)

  const [createMutation, { data: createData, loading: creating, crateError }] =
    useMutation(CREATE_REMOVAL_APPLICATION)

  const [updateMutation, { data: updateData, loading: updating, updateError }] =
    useMutation(UPDATE_REMOVAL_APPLICATION)

  const createHandler = (values, setSubmitting) => {
    const normalizedValues = getNormalizedValues(values)
    createMutation({
      variables: { application: normalizedValues },
      fetchPolicy: 'no-cache',
    })
      .then((data) => {
        setSubmitting(false)
        router.push('/removal/application')
      })
      .catch((err) => {
        console.log(err)
        setBackendError('Возникла ошибка при создании заявки')
      })
  }

  const updateHandler = (values, setSubmitting) => {
    const normalizedValues = getNormalizedValues(values)
    updateMutation({ variables: { id: id, newValues: normalizedValues } })
      .then((data) => {
        setSubmitting(false)
      })
      .catch((err) => {
        console.log(err)
        setBackendError('Возникла ошибка при сохранении заявки')
      })
  }

  return (
    <>
      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={removalApplicationSchema}
        onSubmit={(values, { setSubmitting }) => {
          if (id) {
            updateHandler(values, setSubmitting)
          } else {
            createHandler(values, setSubmitting)
          }
        }}
      >
        {({ isSubmitting, values, setFieldValue }) => {
          const [
            getRemovalApplication,
            {
              called,
              loading: gettingApplication,
              data: applicationData,
              error: gettingError,
            },
          ] = useLazyQuery(GET_REMOVAL_APPLICATION)

          const {
            loading: gettingWasteTypes,
            data: wasteTypesData,
            error: wasteTypesError,
          } = useQuery(GET_WASTE_TYPES)

          useEffect(() => {
            if (id && !called) getRemovalApplication({ variables: { id } })
            if (applicationData && wasteTypesData) {
              fields.forEach((field) =>
                setFieldValue(
                  field,
                  field === 'wasteType'
                    ? applicationData.getRemovalApplication[field]['_id']
                    : applicationData.getRemovalApplication[field],
                  false
                )
              )
            }
          }, [id, applicationData, wasteTypesData])

          const shouldDisable =
            gettingApplication || gettingWasteTypes || isSubmitting

          if (gettingError)
            return <Typography>Возникла ошибка при загрузке данных</Typography>

          if (crateError)
            return (
              <Typography>Возникла ошибка при сохранении данных</Typography>
            )

          return (
            <Form className={classes.formRoot}>
              {(gettingApplication || gettingWasteTypes) && (
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
              )}
              <Grid
                item
                container
                component="fieldset"
                className={classes.gridContainer}
              >
                <Grid item xs={12} className={classes.sectionTitle}>
                  <Typography gutterBottom variant="h4">
                    Параметры заявки
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
                      justify="center"
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
                      justify="center"
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
      <Grid item xs={12}>
        <SendMessage />
      </Grid>
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
