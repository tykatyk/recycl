import React, { useEffect, useMemo } from 'react'
import Autocomplete from '@mui/material/Autocomplete'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import { Box, Typography, TextField, Chip } from '@mui/material'
import { fieldToTextField } from 'formik-mui'
import throttle from 'lodash/throttle'
import parse from 'autosuggest-highlight/parse'
import Listbox from './Listbox'
import { APIProvider, useMapsLibrary } from '@vis.gl/react-google-maps'

let autocompleteService = null

function PlacesAutocompleteComponent(props) {
  const {
    form: { setFieldValue, handleBlur, setFieldTouched, values },
    field: { name },
    multiple,
  } = props

  const masterField = props['data-master']
  const masterFieldValue = values[masterField]

  const { label, variant, value, error, helperText, disabled } =
    fieldToTextField(props)

  const [inputValue, setInputValue] = React.useState('')

  const [options, setOptions] = React.useState([])
  const [sessionToken, setSessionToken] = React.useState(null)
  const placesLib = useMapsLibrary('places')

  const fetch = useMemo(
    () =>
      throttle((request, callback) => {
        autocompleteService.getPlacePredictions(request, callback)
      }, 200),
    [],
  )

  useEffect(() => {
    let active = true

    if (!autocompleteService && placesLib) {
      autocompleteService = new placesLib.AutocompleteService()
      setSessionToken(new placesLib.AutocompleteSessionToken())
    }

    if (!autocompleteService) return

    if (inputValue === '') {
      setOptions(value ? (multiple ? value : [value]) : [])
      return
    }

    fetch(
      {
        input: inputValue,
        types: ['geocode'],
        componentRestrictions: { country: 'ua' },
        region: 'ua',
        sessionToken,
      },
      (results) => {
        if (active) {
          let newOptions = []

          if (value) {
            newOptions = multiple ? value : [value]
          }

          if (results) {
            newOptions = [...newOptions, ...results]
          }

          setOptions(newOptions)
        }
      },
    )

    return () => {
      active = false
    }
  }, [value, inputValue, fetch, multiple, sessionToken, placesLib])

  useEffect(() => {
    if (masterField && !masterFieldValue) {
      setOptions([])

      if (multiple) {
        setFieldValue(name, [], false)
      } else {
        setFieldValue(name, '', false)
      }

      setFieldTouched(name, false, false)
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
      slotProps={{
        listbox: {
          component: Listbox,
        },
      }}
      options={options}
      multiple={multiple || false}
      disabled={disabled}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue)
      }}
      onChange={(event, newValue) => {
        if (multiple) {
          setOptions(newValue.length > 0 ? [...newValue] : options)
        } else {
          setOptions(newValue ? [newValue] : [])
        }
        setFieldValue(name, newValue)
        // if (autocompleteService && window.google) {
        //   setSessionToken(new google.maps.places.AutocompleteSessionToken())
        // }
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
          />
        )
      }}
      renderOption={(props, option) => {
        const { key, ...rest } = props
        const matches =
          option.structured_formatting.main_text_matched_substrings || []

        const parts = parse(
          option.structured_formatting.main_text,
          matches.map((match) => [match.offset, match.offset + match.length]),
        )

        return (
          <li key={key} {...rest}>
            <Box
              sx={{
                display: 'flex',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                justifyContent: 'center',
              }}
            >
              <Box>
                <LocationOnIcon sx={{ mr: 2 }} />
              </Box>
              <Box sx={{ overflow: 'hidden', dispay: 'flex', flexShrink: 1 }}>
                {parts.map((part, index) => (
                  <Box
                    component="span"
                    variant="body2"
                    key={index}
                    sx={{
                      fontWeight: part.highlight ? 700 : 400,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {part.text}
                  </Box>
                ))}

                <Typography
                  variant="body2"
                  sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}
                >
                  {option.structured_formatting.secondary_text}
                </Typography>
              </Box>
            </Box>
          </li>
        )
      }}
    />
  )
}

export default function PlacesAutocomplete(props) {
  return (
    <APIProvider
      apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_BROWSER_KEY || ''}
      language="uk"
    >
      <PlacesAutocompleteComponent {...props} />
    </APIProvider>
  )
}
