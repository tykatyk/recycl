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
import PlacesAutocomplete from './PlacesAutocomplete.jsx'
import Layout from './layouts/Layout.jsx'

const useStyles = makeStyles((theme) => ({
  icon: {
    color: theme.palette.text.secondary,
    marginRight: theme.spacing(2)
  },
  formControl: {
    '& fieldset': { borderColor: `${theme.palette.text.secondary}` },
    '& svg': { color: `${theme.palette.text.secondary}` }
  }
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
  //
  return (
    <Layout>
      <Grid
        container
        direction="column"
        spacing={2}
        style={{
          width: '100%',
          maxWidth: '700px',
          margin: '24px auto',
          padding: '0 24px',
          boxSizing: 'border-box'
        }}
      >
        <Grid item container spacing={2} style={{ padding: '0 0 56px 0' }}>
          <Typography gutterBottom variant="h4" color="secondary">
            Параметры заявки
          </Typography>
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Местонахождение отходов
            </Typography>
            <PlacesAutocomplete />
          </Grid>
          <Grid container item direction="row" xs={12}>
            <Grid item xs={12} sm={9}>
              <Typography gutterBottom>Тип</Typography>
              <FormControl
                variant="outlined"
                className={classes.formControl}
                fullWidth
                style={{ paddingRight: '20px' }}
              >
                <TextField
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
                        horizontal: 'left'
                      },
                      transformOrigin: {
                        vertical: 'top',
                        horizontal: 'left'
                      },
                      autoWidth: true,
                      getContentAnchorEl: null
                    }
                  }}
                >
                  <MenuItem value={0}>Не выбрано</MenuItem>
                  <MenuItem value={1}>Шины</MenuItem>
                  <MenuItem value={2}>Батарейки</MenuItem>
                  <MenuItem value={3} style={{ maxWidth: '100%' }}>
                    ПЕТ бутылка
                  </MenuItem>
                </TextField>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={3}>
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
                    )
                  }}
                  InputLabelProps={{
                    shrink: true
                  }}
                />
              </FormControl>
            </Grid>
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
        <Grid item container spacing={2} style={{ paddingBottom: '56px' }}>
          <Typography gutterBottom variant="h4" color="secondary">
            Параметры уведомлений
          </Typography>
          <Grid item xs={12}>
            <FormControlLabel
              control={<Checkbox name="radius" />}
              label="Получать уведомления о приеме отходов в радиусе"
            />
            <TextField
              className={classes.formControl}
              id="radius"
              type="number"
              variant="outlined"
              InputProps={{
                endAdornment: <InputAdornment position="end">Км</InputAdornment>
              }}
              InputLabelProps={{
                shrink: true
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={<Checkbox name="cities" />}
              label="Получать уведомления независимо от радиуса для следующих населенных пунктов"
            />
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" color="secondary">
            Сохранить
          </Button>
        </Grid>
      </Grid>
    </Layout>
  )
}
