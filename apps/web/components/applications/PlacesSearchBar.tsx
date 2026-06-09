import { Autocomplete, Box, Chip, TextField, Typography } from '@mui/material'
import { useEffect, useMemo } from 'react'
import { colors } from '../../lib/helpers/themeStub'
const { darkBlueGreen } = colors
import LocationOnIcon from '@mui/icons-material/LocationOn'
import parse from 'autosuggest-highlight/parse'
import Listbox from '../uiParts/formInputs/Listbox'
import React from 'react'
import throttle from 'lodash/throttle'

export default function PlacesSearchBar({ map }) {
  const [inputValue, setInputValue] = React.useState('')
  const [value, setValue] = React.useState('')
  const [options, setOptions] = React.useState([])
  const [sessionToken, setSessionToken] = React.useState(null)

  const autocompleteService = useMemo(() => {
    if (!window.google) return null

    return new google.maps.places.AutocompleteService()
  }, [])

  const placesService = useMemo(() => {
    if (!window.google || !map) return null

    return new google.maps.places.PlacesService(map)
  }, [map])

  const fetch = React.useMemo(
    () =>
      throttle((request, callback) => {
        if (!autocompleteService) return
        autocompleteService.getPlacePredictions(request, callback)
      }, 200),
    [autocompleteService],
  )

  React.useEffect(() => {
    let active = true
    // if (!map) return

    if (!window.google) return

    if (!autocompleteService) {
      setOptions([])
      return
    }

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
          let newOptions = []

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
  }, [value, inputValue, fetch, autocompleteService])

  useEffect(() => {
    if (!window.google) return

    setSessionToken(new google.maps.places.AutocompleteSessionToken())
  }, [])

  useEffect(() => {
    if (!value || !placesService) return

    placesService.getDetails(
      {
        placeId: value.place_id,
        fields: ['geometry', 'formatted_address', 'name'],
      },
      (place) => {
        if (!place?.geometry?.location) return

        map.panTo(place.geometry.location)
        map.setZoom(13)
      },
    )
  }, [value, placesService])

  if (!map) return null

  return (
    <Box
      sx={{
        position: 'absolute',
        top: 8,
        left: 0,
        right: 0,
        margin: 'auto',
        width: 300,
        zIndex: 1,
        borderRadius: '8px',
        background: '#fff',
        p: 1,
        boxShadow: '1px 1px 5px #6e6d6d',
      }}
    >
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
        sx={{
          input: { color: 'grey.800' },
        }}
        slotProps={{
          clearIndicator: {
            sx: {
              color: '#1a2b34',
              '&:hover': {
                backgroundColor: 'rgba(26, 43, 52, 0.08)',
              },
            },
          },

          popupIndicator: {
            sx: {
              color: '#1a2b34',
              '&:hover': {
                backgroundColor: 'rgba(26, 43, 52, 0.08)',
              },
            },
          },
        }}
        filterOptions={(x) => x}
        ListboxComponent={Listbox}
        options={options}
        onInputChange={(event, newInputValue) => {
          setInputValue(newInputValue)
        }}
        onChange={(event, newValue) => {
          // setOptions(newValue ? [newValue] : [])

          setValue(newValue)

          if (autocompleteService.current && window.google) {
            setSessionToken(new google.maps.places.AutocompleteSessionToken())
          }
        }}
        // onBlur={handleBlur}
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
              variant={'outlined'}
              label={'Поиск на карте'}
              name={'search'}
              size={'small'}
              sx={{
                '& .MuiInputLabel-root.Mui-focused': { color: '#1a2b34' }, // Focused

                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': {
                    borderColor: '#1a2b34',
                  },
                },
              }}
              InputLabelProps={{
                sx: {
                  color: 'grey.600', // Normal state color
                  // '& .MuiInputLabel-root': { color: 'red' }, // Default
                },
              }}
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
    </Box>
  )
}
