import React, { useEffect, useMemo, useRef } from 'react'
import Autocomplete from '@mui/material/Autocomplete'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import { Box, Typography, TextField, Chip, ListItem } from '@mui/material'
import throttle from 'lodash/throttle'
import parse from 'autosuggest-highlight/parse'
import Listbox from './Listbox'
import { APIProvider, useMapsLibrary } from '@vis.gl/react-google-maps'
import type { PlaceTypeWithMatchedSubstrings } from '../../../lib/types/placeAutocomplete'

type PlacesAutocompleteProps = {
  name: string
  label: string
  variant: 'outlined' | 'filled' | 'standard'
  onBlur: (e) => void
  onChange: (e) => void
  value: PlaceTypeWithMatchedSubstrings
  error?: boolean
  helperText?: string
  disabled?: boolean
}

function PlacesAutocompleteNew(props: PlacesAutocompleteProps) {
  const {
    name,
    label,
    variant = 'outlined',
    onBlur,
    onChange,
    value,
    error,
    helperText,
    disabled,
  } = props

  const autocompleteService =
    useRef<google.maps.places.AutocompleteService | null>(null)

  const [inputValue, setInputValue] = React.useState('')

  const [options, setOptions] = React.useState<
    PlaceTypeWithMatchedSubstrings[]
  >([])
  const [sessionToken, setSessionToken] =
    React.useState<google.maps.places.AutocompleteSessionToken | null>(null)
  const placesLib = useMapsLibrary('places')

  const fetch = useMemo(
    () =>
      throttle((request, callback) => {
        if (!autocompleteService.current) return
        autocompleteService.current.getPlacePredictions(request, callback)
      }, 200),
    [],
  )

  useEffect(() => {
    let active = true

    if (!autocompleteService.current && placesLib) {
      autocompleteService.current = new placesLib.AutocompleteService()
      setSessionToken(new placesLib.AutocompleteSessionToken())
    }

    if (!autocompleteService.current) return

    if (inputValue === '') {
      setOptions(value ? [value] : [])
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
          let newOptions: PlaceTypeWithMatchedSubstrings[] = []

          if (value) {
            newOptions = [value]
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
  }, [value, inputValue, fetch, sessionToken, placesLib])

  return (
    <Autocomplete
      value={value}
      onChange={onChange}
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
      disabled={disabled}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue)
      }}
      autoComplete
      includeInputInList
      filterSelectedOptions
      renderTags={(value, getTagProps) => {
        return value.map((option, index) => (
          <Chip
            {...getTagProps({ index })}
            variant="outlined"
            label={option.description}
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
            onBlur={onBlur}
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
          <ListItem key={key} {...rest}>
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
          </ListItem>
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
      <PlacesAutocompleteNew {...props} />
    </APIProvider>
  )
}
