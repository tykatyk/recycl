import {
  Autocomplete,
  Box,
  Button,
  ListItem,
  TextField,
  Typography,
} from '@mui/material'
import { useEffect, useState } from 'react'
import PlacesAutocompleteNew from './formInputs/PlacesAutocompleteNew'
import { useFormik } from 'formik'
import NumberField from './formInputs/NumberField'
import { adSearchFormSchema } from '../../lib/validation'
import { useSnackbar } from 'notistack'
import { InferType } from 'yup'

const errorMessage = 'Что-то пошло не так'

export default function AdSidebarItemsList(props) {
  const { handleSubmit, initialFormValues } = props
  const { validSearchRadius } = props
  const [wasteTypes, setWasteTypes] = useState<string[]>([])
  const { enqueueSnackbar } = useSnackbar()

  type AdSearchForm = InferType<typeof adSearchFormSchema>
  const formik = useFormik<AdSearchForm>({
    initialValues: {
      wasteType: null,
      wasteLocation: null,
      searchRadius: validSearchRadius,
    },
    validationSchema: adSearchFormSchema,
    onSubmit: handleSubmit,
  })

  const [numberFieldDisabled, setumberFieldDisabled] = useState(false)

  useEffect(() => {
    if (!formik.values.wasteLocation) {
      formik.setFieldValue('searchRadius', 0)
      formik.setFieldTouched('searchRadius', false)
      formik.setFieldError('searchRadius', undefined)
      setumberFieldDisabled(true)
      return
    }
    setumberFieldDisabled(false)
  }, [formik.values.wasteLocation])

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
            <Box sx={{ mb: 2 }}>
              <Autocomplete
                disablePortal
                options={wasteTypes}
                sx={{ width: '100%' }}
                value={formik.values.wasteType}
                onChange={(event, newValue) => {
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
            <Box sx={{ mb: 2 }}>
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
            <Box sx={{ mb: 3 }}>
              <NumberField
                size="small"
                disabled={numberFieldDisabled}
                label="Радиус поиска, км"
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

            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
              <Button
                type="submit"
                variant="contained"
                disabled={formik.isSubmitting}
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
