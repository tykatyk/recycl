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
import { adSearchFormSchema } from '../../lib/validation/adSearchForm'
import {
  minRadius,
  maxRadius,
  wasteTypeNames,
} from '@recycl/shared/dist/constants'
import { useSnackbar } from 'notistack'
import { InferType } from 'yup'
import type { PlaceTypeWithMatchedSubstrings } from '../../lib/types/placeAutocomplete'
import { useTranslations } from 'use-intl'
import { validateForm } from '../../lib/helpers/errorHelpers'
import { wasteTypeFetcher } from '../../lib/helpers/dataFetcher'

export default function AdSidebarItemsList(props) {
  const { handleSubmit, initialFormValues, howSearchWorks = '' } = props
  const {
    wasteType = null,
    searchRadius = null,
    wasteLocation = null,
  } = initialFormValues

  const [wasteTypes, setWasteTypes] = useState<
    (typeof wasteTypeNames)[number][]
  >([])
  const [modalOpen, setModalOpen] = useState(false)
  const { enqueueSnackbar } = useSnackbar()
  const t = useTranslations('AdSidebarItemsList')
  const tValidationMessages = useTranslations('ValidationMessages')
  const tWasteTypes = useTranslations('WasteTypes')

  type AdSearchForm = InferType<typeof adSearchFormSchema>
  const formik = useFormik<AdSearchForm>({
    initialValues: {
      wasteType,
      wasteLocation,
      searchRadius,
    },
    validate: async (values) => {
      return await validateForm({
        values,
        validationSchema: adSearchFormSchema,
        translations: tValidationMessages,
      })
    },
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
        const data = await wasteTypeFetcher()
        const sorted = data
          .sort((a, b) =>
            tWasteTypes(a.name).localeCompare(tWasteTypes(b.name)),
          )
          .map((item) => item.name)
        setWasteTypes(sorted)
      } catch (error) {
        enqueueSnackbar(t('errorMessage'), { variant: 'error' })
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
          <Box sx={{ width: '100%', p: 1 }}>
            <form onSubmit={formik.handleSubmit} style={{ width: '100%' }}>
              <Box sx={{ mb: 2 }}>
                <Autocomplete<(typeof wasteTypeNames)[number]>
                  disablePortal
                  options={wasteTypes}
                  sx={{ width: '100%' }}
                  value={formik.values.wasteType as any}
                  onChange={(event, newValue) => {
                    formik.setFieldValue('wasteType', newValue)
                  }}
                  getOptionLabel={(option) =>
                    wasteTypeNames.includes(option) ? tWasteTypes(option) : ''
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      id="wasteType"
                      name="wasteType"
                      label={t('form.wasteTypeLabel')}
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
                    label={t('form.wasteLocationLabel')}
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
                    {t('form.howSearchWorksBtn')}
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
                        width: 'calc(100% - 32px)',
                        maxWidth: 400,
                        maxHeight: 'calc(100vh - 32px)',
                        bgcolor: 'background.paper',
                        border: '2px solid #000',
                        boxShadow: 24,
                        p: 4,
                      }}
                    >
                      <Typography>{howSearchWorks}</Typography>
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
                  label={t('form.searchRadiusLabel')}
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
                  {t('form.submitBtn')}
                </Button>
              </Box>
            </form>
          </Box>
        </Box>
      </ListItem>
    </>
  )
}
