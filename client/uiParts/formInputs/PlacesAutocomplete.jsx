import React from 'react'
import Autocomplete from '@material-ui/lab/Autocomplete'
import LocationOnIcon from '@material-ui/icons/LocationOn'
import {
  Grid,
  Typography,
  TextField,
  Chip,
  makeStyles,
} from '@material-ui/core'
import { fieldToTextField } from 'formik-material-ui'
import throttle from 'lodash/throttle'
import parse from 'autosuggest-highlight/parse'
import Listbox from './Listbox.jsx'

function loadScript(src, position, id) {
  if (!position) return
  const script = document.createElement('script')
  script.setAttribute('async', '')
  script.setAttribute('id', id)
  script.src = src
  position.appendChild(script)
}

const autocompleteService = { current: null }

const useStyles = makeStyles((theme) => ({
  locationIcon: {
    marginRight: theme.spacing(2),
  },
  paper: ({ backgroundColor }) => {
    return {
      background: backgroundColor
        ? backgroundColor
        : theme.palette.background.paper,
    }
  },
}))

export default function PlacesAutocomplete(props) {
  const {
    form: { setFieldValue, handleBlur, setFieldTouched, values },
    field: { name },
  } = props

  const { label, variant, value, error, helperText, disabled } =
    fieldToTextField(props)
  const classes = useStyles(props)
  const [inputValue, setInputValue] = React.useState('')
  const [open, setOpen] = React.useState(false)
  const [shouldOpen, setShouldOpen] = React.useState(false)
  const [options, setOptions] = React.useState([])
  const [sessionToken, setSessionToken] = React.useState(null)
  const loaded = React.useRef(false)

  if (typeof window !== 'undefined' && !loaded.current) {
    if (!document.querySelector('#google-maps')) {
      loadScript(
        `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_AUTOCOMPLETE}&libraries=places`,
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
    if (!shouldOpen) {
      setInputValue(value ? value.description : '')
    }

    if (!autocompleteService.current && window.google) {
      autocompleteService.current = new google.maps.places.AutocompleteService()
      setSessionToken(new google.maps.places.AutocompleteSessionToken())
    }
    if (!autocompleteService.current) return undefined

    if (inputValue === '') {
      setOptions(value ? (props.multiple ? value : [value]) : [])
      return undefined
    }

    fetch(
      { input: inputValue, types: ['(cities)'], sessionToken },
      (results) => {
        if (active) {
          let newOptions = []

          if (value) {
            newOptions = props.multiple ? value : [value]
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

  const masterField = props['data-master']

  const [key, setKey] = React.useState(new Date().getTime())

  React.useEffect(() => {
    if (masterField && !values[masterField]) {
      setOptions([])

      if (props.multiple) {
        setFieldValue(name, [], false)
      } else {
        setFieldValue(name, '', false)
      }

      setFieldTouched(name, false, false)
      setKey(new Date().getTime())
    }
  }, [values[masterField]])

  return (
    <Autocomplete
      value={value}
      key={key}
      classes={{
        root: classes.root,
        paper: classes.paper,
        focused: classes.focused,
        popupIndicator: classes.popupIndicator,
        clearIndicator: classes.clearIndicator,
      }}
      noOptionsText="Нет вариантов"
      loadingText="Загрузка"
      getOptionLabel={(option) =>
        typeof option === 'string'
          ? option
          : option.description
          ? option.description
          : ''
      }
      filterOptions={(x) => x}
      ListboxComponent={Listbox}
      options={options}
      multiple={props.multiple || false}
      disabled={disabled}
      open={open}
      onOpen={() => {
        if (shouldOpen && inputValue) setOpen(true)
      }}
      onClose={() => setOpen(false)}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue)
        if (shouldOpen && inputValue) {
          setOpen(true)
        } else {
          setOpen(false)
        }
      }}
      onChange={(event, newValue) => {
        if (props.multiple) {
          setOptions(newValue.length > 0 ? [...newValue, ...options] : options)
        } else {
          setOptions(newValue ? [newValue, ...options] : options)
        }
        setFieldValue(name, newValue)
        if (autocompleteService.current && window.google) {
          setSessionToken(new google.maps.places.AutocompleteSessionToken())
        }
      }}
      onBlur={handleBlur}
      autoComplete
      includeInputInList
      filterSelectedOptions
      renderTags={(value, getTagProps) => {
        return value.map((option, index) => (
          <Chip
            variant="outlined"
            label={option.description}
            {...getTagProps({ index })}
          />
        ))
      }}
      renderInput={(params) => {
        return (
          <TextField
            {...params}
            fullWidth
            variant={variant}
            name={name}
            InputLabelProps={{
              classes: {
                focused: classes.inputLabelFocused,
              },
            }}
            helperText={helperText}
            label={label}
            error={error}
            onFocus={() => {
              if (!shouldOpen) setShouldOpen(true)
            }}
          />
        )
      }}
      renderOption={(option) => {
        if (
          option.structured_formatting &&
          option.structured_formatting.main_text_matched_substrings
        ) {
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
        }

        return (
          <Grid container alignItems="center">
            <Grid item>
              <LocationOnIcon className={classes.locationIcon} />
            </Grid>
            <Grid item xs>
              <span key={index} style={{ fontWeight: 700 }}>
                {option.structured_formatting &&
                option.structured_formatting.main_text
                  ? option.structured_formatting.main_text
                  : ''}
              </span>

              <Typography variant="body2">
                {option.structured_formatting &&
                option.structured_formatting.secondary_text
                  ? option.structured_formatting.secondary_text
                  : ''}
              </Typography>
            </Grid>
          </Grid>
        )
      }}
    />
  )
}
