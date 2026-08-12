import {
  Autocomplete,
  Box,
  Button,
  ListItem,
  Modal,
  TextField,
  Typography,
} from '@mui/material'
import { useEffect, useState } from 'react'
import PlacesAutocompleteNew from './formInputs/PlacesAutocompleteNew'
import { useFormik } from 'formik'
import NumberField from './formInputs/NumberField'
import {
  adSearchFormSchema,
  minRadius,
  maxRadius,
} from '../../lib/validation/adSearchForm'
import { useSnackbar } from 'notistack'
import { InferType } from 'yup'
import type { PlaceTypeWithMatchedSubstrings } from '../../lib/types/placeAutocomplete'

const errorMessage = 'Что-то пошло не так'

export default function AdSidebarItemsList(props) {
  const { handleSubmit, initialFormValues } = props
  const {
    wasteType = null,
    searchRadius = null,
    wasteLocation = null,
  } = initialFormValues

  const [wasteTypes, setWasteTypes] = useState<string[]>([])
  const { enqueueSnackbar } = useSnackbar()
  const [modalOpen, setModalOpen] = useState(false)

  type AdSearchForm = InferType<typeof adSearchFormSchema>
  const formik = useFormik<AdSearchForm>({
    initialValues: {
      wasteType,
      wasteLocation,
      searchRadius,
    },
    validationSchema: adSearchFormSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
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
    <>
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
                <Box>
                  <PlacesAutocompleteNew
                    name="wasteLocation"
                    label="Местоположение"
                    value={formik.values.wasteLocation}
                    onChange={(
                      event,
                      newValue: PlaceTypeWithMatchedSubstrings,
                    ) => {
                      formik.setFieldValue('wasteLocation', newValue)
                    }}
                    onBlur={() => formik.setFieldTouched('wasteLocation', true)}
                    error={
                      formik.touched.wasteLocation &&
                      Boolean(formik.errors.wasteLocation)
                    }
                    helperText={
                      formik.touched.wasteLocation &&
                      formik.errors.wasteLocation
                    }
                    disabled={formik.isSubmitting}
                  />
                </Box>
                <Box>
                  <Button
                    size="small"
                    color="warning"
                    onClick={() => setModalOpen(!modalOpen)}
                    sx={{ fontWeight: 'fontWeightLight', fontSize: '10px' }}
                  >
                    Как работает поиск
                  </Button>
                </Box>
                <Box>
                  <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
                    <Box
                      sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: 'background.paper',
                        border: '2px solid #000',
                        boxShadow: 24,
                        p: 4,
                      }}
                    >
                      <Typography>
                        {
                          'При поиске по местоположению объявления ищутся только в указанной точке. Например, при указанном местоположении "Винница", вы увидите объявления, в которых местоположение указано как "Винница", но не "ул. Пирогова, Винница", "ул. Келецакая, Винница" и т. д. Для поиска по региону, рекомендуем кроме местоположения также указывать радиус поиска.'
                        }
                      </Typography>
                    </Box>
                  </Modal>
                </Box>
              </Box>

              <Box sx={{ mb: 3 }}>
                <NumberField
                  min={minRadius}
                  max={maxRadius}
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
    </>
  )
}
