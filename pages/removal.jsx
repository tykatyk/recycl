import React from 'react'
import LocationOnIcon from '@material-ui/icons/LocationOn'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import MenuItem from '@material-ui/core/MenuItem'
import Button from '@material-ui/core/Button'
import { Select } from 'formik-material-ui'
import Checkbox from '@material-ui/core/Checkbox'
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import InputAdornment from '@material-ui/core/InputAdornment'
import Divider from '@material-ui/core/Divider'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import PlacesAutocomplete from '../src/components/PlacesAutocomplete.jsx'
import Layout from '../src/components/Layout.jsx'
import { Formik, Form, Field } from 'formik'
import * as yup from 'yup'
import InputLabel from '@material-ui/core/InputLabel'
import TextFieldFormic from '../src/components/TextFieldFormic.jsx'

const useStyles = makeStyles((theme) => ({
  formRoot: {
    '& > fieldset': {
      margin: 0,
      marginBottom: theme.spacing(5),
      padding: 0,
      border: 'none',
    },
  },
  formControl: {
    '& fieldset': { borderColor: `${theme.palette.text.secondary}` },
    '& svg': { color: `${theme.palette.text.secondary}` },
  },
  gridContainer: {
    '& > div': {
      paddingBottom: theme.spacing(2),
    },
    '& > div:last-child': {
      paddingBottom: 0,
    },
  },
  sectionTitle: {
    '& h4': { marginBottom: 0 },
  },
}))

const validationSchema = yup.object({
  autocomplete: yup.mixed().required('Это поле не может быть пустым'),
})

export default function HandOverClaim() {
  const classes = useStyles()
  const theme = useTheme()

  return (
    <Layout>
      <Grid
        container
        direction="column"
        style={{
          maxWidth: '700px',
          margin: '0 auto',
          padding: '16px',
        }}
      >
        <Formik
          initialValues={{
            autocomplete: '',
            autocomplete2: [],
            wasteType: '',
          }}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting }) => {
            setTimeout(() => {
              setSubmitting(false)
              alert(JSON.stringify(values, null, 2))
            }, 500)
          }}
        >
          {({ submitForm, isSubmitting, errors, touched }) => (
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
                    name="autocomplete"
                    label="Местоположение отходов"
                    variant="outlined"
                    fullWidth
                    component={PlacesAutocomplete}
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
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography gutterBottom>Примечание</Typography>
                  <Field
                    component={TextFieldFormic}
                    className={classes.formControl}
                    multiline
                    rows={3}
                    variant="outlined"
                    fullWidth
                    name="comment"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={<Checkbox name="document" />}
                    label="Нужен документ о передаче отходов на переработку"
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
                  <FormControlLabel
                    control={<Checkbox name="radius" />}
                    label="Получать уведомления о приеме отходов в радиусе:"
                  />
                  <Field
                    component={TextFieldFormic}
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
                <Grid item xs={12}>
                  <FormControlLabel
                    control={<Checkbox name="cities" />}
                    label="Получать уведомления независимо от радиуса для следующих населенных пунктов"
                  />
                  <Field
                    name="autocomplete2"
                    variant="outlined"
                    fullWidth
                    multiple
                    component={PlacesAutocomplete}
                  />
                </Grid>
              </Grid>

              <Grid item xs={12} component="fieldset">
                <Button variant="contained" color="secondary">
                  Сохранить
                </Button>
              </Grid>
            </Form>
          )}
        </Formik>
      </Grid>
    </Layout>
  )
}
