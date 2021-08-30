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
import Button from '@material-ui/core/Button'
import { Formik, Form, Field } from 'formik'
import removalFormStyles from './helperData/removalFormStyles'
import RemovalPopover from './RemovalPopover.jsx'
import {
  initialValues,
  validationSchema,
} from './helperData/removalFormConfig.js'

const useStyles = removalFormStyles

export default function RemovalForm(props) {
  const classes = useStyles()
  const theme = useTheme()

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting }) => {
        setTimeout(() => {
          setSubmitting(false)
          alert(JSON.stringify(values, null, 2))
        }, 500)
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
                <Typography gutterBottom variant="h4" color="secondary">
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
                  helperText="*Обязательное поле"
                  component={TextFieldFormic}
                  fullWidth
                  select
                  type="text"
                  id="wasteType"
                  name="wasteType"
                  color="secondary"
                  variant="outlined"
                  label="Тип отходов"
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
                <Typography gutterBottom>Количество</Typography>
                <Field
                  component={TextFieldFormic}
                  inputProps={{ max: 10 }}
                  color="secondary"
                  fullWidth
                  name="quantity"
                  type="number"
                  variant="outlined"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">Кг</InputAdornment>
                    ),
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  helperText="*Обязательное поле"
                />
              </Grid>
              <Grid item xs={12}>
                <Field
                  component={TextFieldFormic}
                  className={classes.formControl}
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
                <Typography gutterBottom variant="h4" color="secondary">
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
                      component={TextFieldFormic}
                      disabled={!values.notificationRadiusCheckbox}
                      className={classes.formControl}
                      name="notificationRadius"
                      type="number"
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
