import { React, useEffect, useState } from 'react'
import { styled, useTheme } from '@mui/material/styles'
import { Grid, Typography, InputAdornment, Button } from '@mui/material'
import PlacesAutocomplete from '../uiParts/formInputs/PlacesAutocomplete'
import TextFieldFormik from '../uiParts/formInputs/TextFieldFormik'
import TextFieldDependantFormik from '../uiParts/formInputs/TextFieldDependantFormik'
import RemovalPopover from './RemovalPopover'
import SelectFormik from '../uiParts/formInputs/SelectFormik'
import PageLoadingCircle from '../uiParts/PageLoadingCircle'
import Snackbar from '../uiParts/Snackbars'
import ButtonSubmittingCircle from '../uiParts/ButtonSubmittingCircle'
import { CheckboxWithLabel } from 'formik-mui'
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
import { getInitialValues, getNormalizedValues } from './removalFormConfig.js'
import { removalApplicationSchema } from '../../lib/validation'

const PREFIX = 'RemovalForm'

const classes = {
  formRoot: `${PREFIX}-formRoot`,
  gridContainer: `${PREFIX}-gridContainer`,
  sectionTitle: `${PREFIX}-sectionTitle`,
}

// TODO jss-to-styled codemod: The Fragment root was replaced by div. Change the tag if needed.
const Root = styled('div')(({ theme }) => ({
  [`& .${classes.formRoot}`]: {
    '& > fieldset': {
      margin: 0,
      marginBottom: theme.spacing(5),
      padding: 0,
      border: 'none',
    },
  },

  [`& .${classes.gridContainer}`]: {
    '& > div': {
      paddingBottom: theme.spacing(2),
    },
    '& > div:last-child': {
      paddingBottom: 0,
    },
  },

  [`& .${classes.sectionTitle}`]: {
    '& h4': { marginBottom: 0 },
  },
}))

const initialValues = getInitialValues()
const fields = Object.keys(initialValues)

export default function RemovalForm(props) {
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
        router.push('/my/applications')
      })
      .catch((error) => {
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
    return <PageLoadingCircle />
  }

  const RemovalForm = () => {
    const { setFieldValue, isSubmitting, values } = useFormikContext()
    const shouldDisable =
      gettingApplication || gettingWasteTypes || isSubmitting

    useEffect(() => {
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
                  disabled={!values.notificationRadiusCheckbox || shouldDisable}
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
                  <Typography variant="body2" style={{ maxWidth: '20em' }}>
                    Выберите эту опцию если, например, в вашем населенном пункте
                    нет пунктов приема отходов указанных в заявке
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
                  disabled={!values.notificationCitiesCheckbox || shouldDisable}
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
                  <Typography variant="body2" style={{ maxWidth: '20em' }}>
                    Выберите эту опцию если вы часто бываете в определенных
                    населенных пунктах и можете сдать отходы там
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
            {isSubmitting && <ButtonSubmittingCircle />}
          </Button>
        </Grid>
      </Form>
    )
  }

  return (
    <Root>
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
        <RemovalForm />
      </Formik>
      <Snackbar
        severity="error"
        open={!!backendError}
        message={backendError}
        handleClose={() => {
          setBackendError(null)
        }}
      />
    </Root>
  )
}
