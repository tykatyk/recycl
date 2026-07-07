import {
  Autocomplete,
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  ListItem,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@mui/material'
import { useEffect, useState } from 'react'
import PlacesAutocompleteNew from './formInputs/PlacesAutocompleteNew'
import { useFormik } from 'formik'
import NumberField from './formInputs/NumberField'
import { adSearchFormSchema } from '../../lib/validation'
import { useSnackbar } from 'notistack'

const errorMessage = 'Что-то пошло не так'

export default function AdSidebarItemsList(props) {
  const [ads, setAds] = useState([])
  const [wasteTypes, setWasteTypes] = useState<string[]>([])
  const { enqueueSnackbar } = useSnackbar()

  const formik = useFormik({
    initialValues: {
      wasteType: null,
      wasteLocation: null,
      searchType: 'point',
      searchRadius: null,
    },
    validationSchema: adSearchFormSchema,
    //ToDo: implement onSubmit
    onSubmit: async (values) => {
      try {
        const { wasteType, wasteLocation, searchType, searchRadius } = values

        const query = new URLSearchParams()

        if (wasteType) {
          query.set('wasteType', wasteType)
        }
        if (wasteLocation) {
          query.set('wasteLocation', wasteLocation.place_id)
        }
        if (searchType) {
          query.set('searchType', searchType)
        }
        if (searchRadius) {
          query.set('searchRadius', String(searchRadius))
        }
        console.log(query.toString())
        const response = await fetch(`/api/ads/list?${query.toString()}`)
        const data = await response.json()
        setAds(data || [])
      } catch (error) {
        enqueueSnackbar(errorMessage, { variant: 'error' })
      }
      setAds([])
    },
  })

  const [numberFieldDisabled, setumberFieldDisabled] = useState(false)

  useEffect(() => {
    if (formik.values.searchType !== 'radius' || !formik.values.wasteLocation) {
      formik.setFieldValue('searchRadius', null)
      formik.setFieldTouched('searchRadius', false)
      formik.setFieldError('searchRadius', undefined)
      setumberFieldDisabled(true)
      return
    }
    setumberFieldDisabled(false)
  }, [formik.values.searchType, formik.values.wasteLocation])

  useEffect(() => {
    const fetcher = async () => {
      try {
        const response = await fetch('/api/waste-types')
        const data = await response.json()
        const mapped = data.map((item) => item.name)
        setWasteTypes(mapped)
      } catch (error) {
        enqueueSnackbar(errorMessage, { variant: 'error' })
      }
    }
    fetcher()
  }, [])

  return (
    <ListItem disableGutters dense divider>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Box sx={{ p: 1 }}>
          <Typography
            component="h1"
            variant="body1"
            sx={{ fontWeight: 'bold' }}
            align="center"
            color="#91d608"
          >
            Объявления о наличии вторсырья
          </Typography>
        </Box>

        <Box sx={{ width: '100%', p: 1 }}>
          <Box
            component="form"
            onSubmit={formik.handleSubmit}
            sx={{ width: '100%' }}
          >
            <Box sx={{ mb: 3 }}>
              <Autocomplete
                disablePortal
                options={wasteTypes}
                sx={{ width: '100%' }}
                value={formik.values.wasteType}
                onChange={(event, newValue) => {
                  console.log(newValue)
                  formik.setFieldValue('wasteType', newValue)
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    id="wasteType"
                    name="wasteType"
                    label="Тип вторсырья"
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.wasteType &&
                      Boolean(formik.errors.wasteType)
                    }
                    helperText={
                      formik.touched.wasteType && formik.errors.wasteType
                    }
                  />
                )}
              />
            </Box>
            <Box sx={{ mb: 3 }}>
              <Box sx={{ mb: 1 }}>
                <PlacesAutocompleteNew
                  name="wasteLocation"
                  label="Местоположение"
                  value={formik.values.wasteLocation}
                  onChange={(event, newValue) => {
                    formik.setFieldValue('wasteLocation', newValue)
                  }}
                  onBlur={() => formik.setFieldTouched('wasteLocation', true)}
                  error={
                    formik.touched.wasteLocation &&
                    Boolean(formik.errors.wasteLocation)
                  }
                  helperText={
                    formik.touched.wasteLocation && formik.errors.wasteLocation
                  }
                  disabled={formik.isSubmitting}
                />
              </Box>
              <Box>
                <Box sx={{ mb: 1 }}>
                  <FormControl disabled={!formik.values.wasteLocation}>
                    <FormLabel id="search-params-label">Искать в</FormLabel>
                    <RadioGroup
                      aria-labelledby="search-params-label"
                      name="searchType"
                      value={formik.values.searchType}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    >
                      <FormControlLabel
                        value="point"
                        control={<Radio />}
                        label="Указанной точке"
                        slotProps={{
                          typography: {
                            variant: 'body2',
                          },
                        }}
                      />
                      <FormControlLabel
                        value="radius"
                        control={<Radio />}
                        label="Указанном радиусе"
                        slotProps={{
                          typography: {
                            variant: 'body2',
                          },
                        }}
                      />
                    </RadioGroup>
                  </FormControl>
                </Box>
                <Box>
                  <NumberField
                    size="small"
                    disabled={numberFieldDisabled}
                    label="Радиус, км"
                    id="searchRadius"
                    name="searchRadius"
                    value={formik.values.searchRadius}
                    onValueChange={(value) => {
                      formik.setFieldValue('searchRadius', value)

                      if (!formik.touched.searchRadius) {
                        formik.setFieldTouched('searchRadius', true, false)
                      }
                    }}
                    error={
                      formik.touched.searchRadius &&
                      Boolean(formik.errors.searchRadius)
                    }
                    helperText={
                      formik.touched.searchRadius && formik.errors.searchRadius
                    }
                  />
                </Box>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
              <Button
                type="submit"
                variant="contained"
                disabled={
                  formik.isSubmitting ||
                  (!formik.values.wasteType && !formik.values.wasteLocation)
                }
                size="small"
              >
                Поиск
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </ListItem>
  )
}
