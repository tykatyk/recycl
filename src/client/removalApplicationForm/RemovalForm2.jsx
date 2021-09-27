import React from 'react'
import {
  Grid,
  Typography,
  MenuItem,
  InputAdornment,
  InputLabel,
  Button,
  CircularProgress,
  makeStyles,
} from '@material-ui/core'

import PlacesAutocomplete from '../PlacesAutocomplete.jsx'
import TextFieldFormik from '../TextFieldFormik.jsx'
import TextFieldDependantFormik from '../TextFieldDependantFormik.jsx'
import RemovalPopover from './RemovalPopover.jsx'
import SelectFormik from '../SelectFormik.jsx'

import { CheckboxWithLabel } from 'formik-material-ui'
import { Formik, Form, Field } from 'formik'
import removalFormStyles from './removalFormStyles'
import { validationSchema } from './removalFormConfig.js'

import { useQuery } from '@apollo/client'
import { GET_WASTE_TYPES } from '../../server/graphqlQueries'

const useStyles = removalFormStyles

export default function RemovalForm(props) {
  const classes = useStyles()
  const { initialValues, submitHandler } = props

  const {
    loading: wasteTypesLoading,
    data: wasteTypesData,
    error: wasteTypesError,
  } = useQuery(GET_WASTE_TYPES)

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting }) => {
        submitHandler(values)
      }}
    >
      {({ submitForm, isSubmitting, errors, touched, values, ...props }) => {
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
                <SelectFormik
                  error={wasteTypesError}
                  loading={wasteTypesLoading}
                  data={wasteTypesData}
                  name={'wasteType'}
                  label={'Тип отходов'}
                  helperText={'*Обязательное поле'}
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
                      id="notificationRadiusCheckbox"
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
                      component={TextFieldDependantFormik}
                      data-master="notificationRadiusCheckbox"
                      name="notificationRadius"
                      disabled={
                        isSubmitting || !values.notificationRadiusCheckbox
                      }
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
                      disabled={
                        isSubmitting || !values.notificationCitiesCheckbox
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
              <Button
                variant="contained"
                color="secondary"
                type="submit"
                disabled={isSubmitting}
                style={{ minWidth: '220px' }}
              >
                Сохранить
                {isSubmitting && (
                  <CircularProgress
                    size={24}
                    style={{ color: 'green', marginLeft: '16px' }}
                  />
                )}
              </Button>
            </Grid>
          </Form>
        )
      }}
    </Formik>
  )
}
