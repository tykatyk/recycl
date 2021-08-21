import React from 'react'
import Autocomplete from '@material-ui/lab/Autocomplete'
import LocationOnIcon from '@material-ui/icons/LocationOn'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'

import { makeStyles } from '@material-ui/core/styles'
import throttle from 'lodash/throttle'
import parse from 'autosuggest-highlight/parse'
import Listbox from './Listbox.jsx'
import envSettings from '../envSettings'

function loadScript(src, position, id) {
  if (!position) {
    return
  }

  const script = document.createElement('script')
  script.setAttribute('async', '')
  script.setAttribute('id', id)
  script.src = src
  position.appendChild(script)
}

const autocompleteService = { current: null }

const useStyles = makeStyles((theme) => ({
  root: {
    '& fieldset': { borderColor: `${theme.palette.text.secondary}` },
  },

  focused: {
    '& fieldset': {
      borderColor: `${theme.palette.secondary.main} !important`,
    },
  },
  clearIndicator: {
    color: 'inherit',
  },
  popupIndicator: {
    color: 'inherit',
  },
  locationIcon: {
    marginRight: theme.spacing(2),
  },
}))

export default function PlacesAutocomplete(props) {
  const classes = useStyles()
  const [value, setValue] = React.useState(null)
  const [inputValue, setInputValue] = React.useState('')
  const [open, setOpen] = React.useState(false)
  const [options, setOptions] = React.useState([])
  const [sessionToken, setSessionToken] = React.useState(null)
  const loaded = React.useRef(false)
  const {
    keys: { googleAutocomplete },
  } = envSettings

  if (typeof window !== 'undefined' && !loaded.current) {
    if (!document.querySelector('#google-maps')) {
      loadScript(
        `https://maps.googleapis.com/maps/api/js?key=${googleAutocomplete}&libraries=places`,
        document.querySelector('head'),
        'google-maps'
      )
    }

    loaded.current = true
  }

  const fetch = React.useMemo(
    () =>
      throttle((request, callback) => {
        autocompleteService.current.getPlacePredictions(request, callback)
      }, 200),
    []
  )

  React.useEffect(() => {
    let active = true

    if (!autocompleteService.current && window.google) {
      autocompleteService.current =
        new window.google.maps.places.AutocompleteService()
      setSessionToken(new google.maps.places.AutocompleteSessionToken())
    }
    if (!autocompleteService.current) {
      return undefined
    }

    if (inputValue === '') {
      setOptions(value ? [value] : [])
      return undefined
    }

    fetch(
      { input: inputValue, types: ['(cities)'], sessionToken },
      (results) => {
        if (active) {
          let newOptions = []

          if (value) {
            newOptions = [value]
          }

          if (results) {
            newOptions = [...newOptions, ...results]
          }

          setOptions(newOptions)
        }
      }
    )

    return () => {
      active = false
    }
  }, [value, inputValue, fetch])

  return (
    <Autocomplete
      classes={{
        root: classes.root,
        focused: classes.focused,
        popupIndicator: classes.popupIndicator,
        clearIndicator: classes.clearIndicator,
      }}
      noOptionsText="Нет вариантов"
      loadingText="Загрузка"
      id="wasteLocation"
      getOptionLabel={(option) =>
        typeof option === 'string' ? option : option.description
      }
      filterOptions={(x) => x}
      ListboxComponent={Listbox}
      options={options}
      open={open}
      onOpen={() => {
        if (inputValue.length > 0) setOpen(true)
      }}
      onClose={() => setOpen(false)}
      autoComplete
      includeInputInList
      filterSelectedOptions
      value={value}
      onChange={(event, newValue) => {
        setOptions(newValue ? [newValue, ...options] : options)
        setValue(newValue)
        setSessionToken(new google.maps.places.AutocompleteSessionToken())
      }}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue)
        inputValue.length > 0 ? setOpen(true) : setOpen(false)
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder="Населенный пункт"
          variant="outlined"
          fullWidth
        />
      )}
      renderOption={(option) => {
        const matches =
          option.structured_formatting.main_text_matched_substrings

        const parts = parse(
          option.structured_formatting.main_text,
          matches.map((match) => [match.offset, match.offset + match.length])
        )

        return (
          <Grid container alignItems="center">
            <Grid item>
              <LocationOnIcon className={classes.locationIcon} />
            </Grid>
            <Grid item xs>
              {parts.map((part, index) => (
                <span
                  key={index}
                  style={{ fontWeight: part.highlight ? 700 : 400 }}
                >
                  {part.text}
                </span>
              ))}

              <Typography variant="body2">
                {option.structured_formatting.secondary_text}
              </Typography>
            </Grid>
          </Grid>
        )
      }}
    />
  )
}
