import React from 'react'
import Autocomplete from '@mui/material/Autocomplete'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import { Grid, Typography, TextField, Chip } from '@mui/material'
import { fieldToTextField } from 'formik-mui'
import throttle from 'lodash/throttle'
import parse from 'autosuggest-highlight/parse'
import Listbox from './Listbox'

function loadScript(src, position, id) {
  if (!position) return
  const script = document.createElement('script')
  script.setAttribute('async', '')
  script.setAttribute('id', id)
  script.src = src
  position.appendChild(script)
}

const autocompleteService = { current: null }

export default function PlacesAutocomplete(props) {
  const {
    form: { setFieldValue, handleBlur, setFieldTouched, values },
    field: { name },
    multiple,
  } = props

  const { label, variant, value, error, helperText, disabled } =
    fieldToTextField(props)

  const [inputValue, setInputValue] = React.useState('')

  const [options, setOptions] = React.useState([])
  const [sessionToken, setSessionToken] = React.useState(null)
  const loaded = React.useRef(false)

  if (typeof window !== 'undefined' && !window.google && !loaded.current) {
    if (!document.querySelector('#google-maps')) {
      loadScript(
        `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_BROWSER_KEY}&libraries=places`,
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

    if (
      !autocompleteService.current &&
      window.google &&
      window.google.maps &&
      window.google.maps.places
    ) {
      autocompleteService.current = new google.maps.places.AutocompleteService()
      setSessionToken(new google.maps.places.AutocompleteSessionToken())
    }

    if (!autocompleteService.current) return undefined

    if (inputValue === '') {
      setOptions(value ? (multiple ? value : [value]) : [])
      return undefined
    }

    fetch(
      { input: inputValue, types: ['(cities)'], sessionToken },
      (results) => {
        if (active) {
          let newOptions = []

          if (value) {
            newOptions = multiple ? value : [value]
          }

          if (results) {
            if (value) {
              results = results.filter(
                (item) => item.place_id !== value.place_id
              )
            }
            newOptions = [...newOptions, ...results]
          }

          setOptions(newOptions)
        }
      }
    )

    return () => {
      active = false
    }
  }, [value, inputValue, fetch, multiple, sessionToken])

  const masterField = props['data-master']
  const masterFieldValue = values[masterField]

  const [key, setKey] = React.useState(new Date().getTime())

  React.useEffect(() => {
    if (masterField && !masterFieldValue) {
      setOptions([])

      if (multiple) {
        setFieldValue(name, [], false)
      } else {
        setFieldValue(name, '', false)
      }

      setFieldTouched(name, false, false)
      setKey(new Date().getTime())
    }
  }, [
    masterField,
    masterFieldValue,
    name,
    multiple,
    setFieldTouched,
    setFieldValue,
  ])

  return (
    <Autocomplete
      value={value}
      key={key}
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
      multiple={multiple || false}
      disabled={disabled}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue)
      }}
      onChange={(event, newValue) => {
        if (multiple) {
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
            key={index}
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
            helperText={helperText}
            label={label}
            error={error}
            // onFocus={() => {
            //   if (!shouldOpen) setShouldOpen(true)
            // }}
          />
        )
      }}
      renderOption={(props, option) => {
        const matches =
          option.structured_formatting.main_text_matched_substrings || []

        const parts = parse(
          option.structured_formatting.main_text,
          matches.map((match) => [match.offset, match.offset + match.length])
        )

        return (
          <li {...props}>
            <Grid container alignItems="center">
              <Grid item>
                <LocationOnIcon sx={{ mr: 2 }} />
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
          </li>
        )
      }}
    />
  )
}
