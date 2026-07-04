import {
  Autocomplete,
  Box,
  Button,
  ListItem,
  TextField,
  Typography,
} from '@mui/material'
import WasteTypesList from './WasteTypesList'
import { useEffect, useState } from 'react'
import PlacesAutocompleteNew from './formInputs/PlacesAutocompleteNew'
import { useFormik } from 'formik'

type WasteItem = {
  _id: string
  name: string
}

export default function AdSidebarItemsList(props) {
  const [wasteTypes, setWasteTypes] = useState<WasteItem[]>([])

  const formik = useFormik({
    initialValues: {
      wasteType: '',
      wasteLocation: '',
    },
    onSubmit: (values) => console.log(values),
  })

  // const { selectedValue, handleChange } = props

  useEffect(() => {
    const fetcher = async () => {
      try {
        const response = await fetch('/api/waste-types')
        const data = await response.json()

        setWasteTypes(data)
      } catch (error) {
        console.log(error)
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
        <Box
          component="form"
          onSubmit={formik.handleSubmit}
          sx={{ width: '100%' }}
        >
          <Box sx={{ width: '100%', p: 1 }}>
            <Box sx={{ pb: 1 }}>
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
              <Autocomplete
                disablePortal
                options={wasteTypes}
                sx={{ width: '100%' }}
                value={formik.values.wasteType}
                onChange={(event, newValue) => {
                  formik.setFieldValue('wasteType', newValue)
                }}
                getOptionLabel={(option) => {
                  if (option) {
                    return option.name
                  }
                  return ''
                }}
                // renderOption={}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    // size="small"
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
