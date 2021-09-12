import React from 'react'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import MenuItem from '@material-ui/core/MenuItem'
import { CheckboxWithLabel } from 'formik-material-ui'
import InputAdornment from '@material-ui/core/InputAdornment'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import PlacesAutocomplete from './PlacesAutocomplete.jsx'
import InputLabel from '@material-ui/core/InputLabel'
import TextFieldFormic from './TextFieldFormic.jsx'
import TextFieldDependantFormic from './TextFieldDependantFormic.jsx'
import Button from '@material-ui/core/Button'
import { Formik, Form, Field } from 'formik'
import removalFormStyles from './helperData/removalFormStyles'
import RemovalPopover from './RemovalPopover.jsx'
import { useRouter } from 'next/router'
import { useMutation, useLazyQuery } from '@apollo/client'
import TextField from '@material-ui/core/TextField'
import {
  CREATE_REMOVAL_APPLICATION,
  GET_REMOVAL_APPLICATION,
  UPDATE_REMOVAL_APPLICATION,
} from '../graphqlQueries'
import {
  getInitialValues,
  validationSchema,
} from './helperData/removalFormConfig.js'

const useStyles = removalFormStyles

export default function RemovalForm(props) {
  const classes = useStyles()
  const theme = useTheme()
  const router = useRouter()
  const { id } = router.query
  const [executeMutation, { data: creatingData, loading: creating, error }] =
    useMutation(CREATE_REMOVAL_APPLICATION)
  const [getRemovalApplication, { loading: getting, data: gettingData }] =
    useLazyQuery(GET_REMOVAL_APPLICATION)
  if (id) {
    getRemovalApplication()
  }
  const initialValues = gettingData || getInitialValues()
  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting }) => {
        console.log(typeof values.quantity)
        const normalizedValues = {}
        Object.assign(normalizedValues, values)

        const wasteLocation = {
          description: values.wasteLocation.description,
          place_id: values.wasteLocation.place_id,
        }
        normalizedValues.wasteLocation = wasteLocation

        const notificationCities = values.notificationCities.map((item) => {
          const normalizedItem = {}
          normalizedItem.description = item.description
          normalizedItem.place_id = item.place_id
          return normalizedItem
        })
        normalizedValues.notificationCities = notificationCities
        executeMutation({ variables: { application: normalizedValues } })
      }}
    >
      {({ submitForm, isSubmitting, errors, touched, values }) => {
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
                />
              </Grid>
              <Grid item xs={12} className={classes.gridContainer}>
                <Field
                  component={TextFieldFormic}
                  fullWidth
                  select
                  type="text"
                  name="wasteType"
                  color="secondary"
                  variant="outlined"
                  label="Тип отходов"
                  helperText="*Обязательное поле"
                  SelectProps={{
                    MenuProps: {
                      anchorOrigin: {
                        vertical: 'bottom',
                        horizontal: 'left',
                      },
                      transformOrigin: {
                        vertical: 'top',
                        horizontal: 'left',
                      },
                      getContentAnchorEl: null,
                    },
                  }}
                >
                  <MenuItem value="">
                    <em>Не выбрано</em>
                  </MenuItem>
                  <MenuItem value={0}>Шины</MenuItem>
                  <MenuItem value={1}>Батарейки</MenuItem>
                  <MenuItem value={2}>ПЕТ бутылка</MenuItem>
                </Field>
              </Grid>
              <Grid item xs={12}>
                <Field
                  component={TextFieldFormic}
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
                />
              </Grid>
              <Grid item xs={12}>
                <Field
                  component={TextFieldFormic}
                  multiline
                  rows={3}
                  variant="outlined"
                  fullWidth
                  name="comment"
                  label="Примечание"
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
                    ></Field>
                  </Grid>
                </Grid>
                <Grid container>
                  <Grid item xs={11}>
                    <Field
                      component={TextFieldDependantFormic}
                      data-master="notificationRadiusCheckbox"
                      disabled={!values.notificationRadiusCheckbox}
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
                      <Typography variant="body2" style={{ maxWidth: '20em' }}>
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
                      disabled={!values.notificationCitiesCheckbox}
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
                      <Typography variant="body2" style={{ maxWidth: '20em' }}>
                        Выберите эту опцию если вы часто бываете в определенных
                        населенных пунктах и може сдать отходы там
                      </Typography>
                    </RemovalPopover>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12} component="fieldset">
              <Button variant="contained" color="secondary" type="submit">
                Сохранить
              </Button>
            </Grid>
          </Form>
        )
      }}
    </Formik>
  )
}
