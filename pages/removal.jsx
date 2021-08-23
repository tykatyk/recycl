import React from 'react'
import TextField from '@material-ui/core/TextField'
import LocationOnIcon from '@material-ui/icons/LocationOn'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import MenuItem from '@material-ui/core/MenuItem'
import Button from '@material-ui/core/Button'
import Select from '@material-ui/core/Select'
import Checkbox from '@material-ui/core/Checkbox'
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import InputAdornment from '@material-ui/core/InputAdornment'
import Divider from '@material-ui/core/Divider'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import PlacesAutocomplete from '../src/components/PlacesAutocomplete.jsx'
import Layout from '../src/components/Layout.jsx'

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

export default function HandOverClaim() {
  const classes = useStyles()
  const theme = useTheme()
  const [anchorEl, setAnchorEl] = React.useState(null)
  const [wasteType, setWasteType] = React.useState('')

  const handleChange = (event) => {
    setWasteType(event.target.value)
  }

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const ref = React.createRef()

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
        <form className={classes.formRoot}>
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
              <Typography variant="subtitle1" gutterBottom>
                Местонахождение отходов
              </Typography>
              <PlacesAutocomplete />
            </Grid>
            <Grid item xs={12} className={classes.gridContainer}>
              <Typography gutterBottom>Тип</Typography>
              <FormControl
                variant="outlined"
                className={classes.formControl}
                fullWidth
              >
                <TextField
                  ref={ref}
                  fullWidth
                  variant="outlined"
                  select
                  id="wasteType"
                  defaultValue="0"
                  onChange={handleChange}
                  color="secondary"
                  onClick={handleMenu}
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
                  <MenuItem value={0}>Не выбрано</MenuItem>
                  <MenuItem value={1}>Шины</MenuItem>
                  <MenuItem value={2}>Батарейки</MenuItem>
                  <MenuItem value={3}>ПЕТ бутылка</MenuItem>
                </TextField>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Typography gutterBottom>Количество</Typography>
              <FormControl className={classes.formControl} fullWidth>
                <TextField
                  inputProps={{ max: 10 }}
                  color="secondary"
                  id="weight"
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
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Typography gutterBottom>Примечание</Typography>
              <TextField
                className={classes.formControl}
                id="note"
                multiline
                rows={3}
                variant="outlined"
                fullWidth
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
              <TextField
                className={classes.formControl}
                id="radius"
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
              <PlacesAutocomplete multiple />
            </Grid>
          </Grid>
          <Grid item xs={12} component="fieldset">
            <Button variant="contained" color="secondary">
              Сохранить
            </Button>
          </Grid>
        </form>
      </Grid>
    </Layout>
  )
}
