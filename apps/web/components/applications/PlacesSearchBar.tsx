import { Autocomplete, Box, Chip, TextField, Typography } from '@mui/material'
import { useEffect, useMemo } from 'react'
import { colors } from '../../lib/helpers/themeStub'
const { darkBlueGreen } = colors
import LocationOnIcon from '@mui/icons-material/LocationOn'
import parse from 'autosuggest-highlight/parse'
import Listbox from '../uiParts/formInputs/Listbox'
import React from 'react'
import throttle from 'lodash/throttle'
import type { PlaceTypeWithMatchedSubstrings } from '../../lib/types/placeAutocomplete'

export default function PlacesSearchBar({ map }) {
  const [inputValue, setInputValue] = React.useState('')
  const [value, setValue] =
    React.useState<PlaceTypeWithMatchedSubstrings | null>(null)
  const [options, setOptions] = React.useState<
    readonly PlaceTypeWithMatchedSubstrings[]
  >([])
  const [sessionToken, setSessionToken] = React.useState<any>(null)

  const autocompleteService = useMemo(() => {
    if (!(window as any).google) return null

    return new (window as any).google.maps.places.AutocompleteService()
  }, [])

  const placesService = useMemo(() => {
    if (!(window as any).google || !map) return null

    return new (window as any).google.maps.places.PlacesService(map)
  }, [map])

  const fetch = useMemo(
    () =>
      throttle((request, callback) => {
        if (!autocompleteService) return
        autocompleteService.getPlacePredictions(request, callback)
      }, 200),
    [autocompleteService],
  )

  useEffect(() => {
    let active = true

    if (!(window as any).google) return

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
          let newOptions: readonly PlaceTypeWithMatchedSubstrings[] = []

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
    if (!(window as any).google || !autocompleteService) return

    setSessionToken(
      new (window as any).google.maps.places.AutocompleteSessionToken(),
    )
  }, [autocompleteService])

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
        map.setZoom(14)
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
          listbox: {
            component: Listbox,
          },
        }}
        filterOptions={(x) => x}
        options={options}
        onInputChange={(event, newInputValue) => {
          setInputValue(newInputValue)
        }}
        onChange={(event, newValue) => {
          setOptions(newValue ? [newValue] : [])

          setValue(newValue)

          if (autocompleteService && (window as any).google) {
            setSessionToken(
              new (window as any).google.maps.places.AutocompleteSessionToken(),
            )
          }
        }}
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
              variant={'outlined'}
              label={'Поиск на карте'}
              name={'search'}
              size={'small'}
              sx={{
                '& .MuiInputLabel-root.Mui-focused': { color: darkBlueGreen },

                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': {
                    borderColor: darkBlueGreen,
                  },
                },
              }}
              slotProps={{
                inputLabel: {
                  sx: {
                    color: 'grey.600',
                  },
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
