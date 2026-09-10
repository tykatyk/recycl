import {
  Button,
  MenuItem,
  Box,
  Chip,
  InputAdornment,
  Stack,
} from '@mui/material'
import PlacesAutocomplete from '../uiParts/formInputs/PlacesAutocomplete'
import ButtonSubmittingCircle from '../uiParts/ButtonSubmittingCircle'
import { Form, Field, useFormikContext } from 'formik'
import 'dayjs/locale/ru'
import type { CollectionPoint } from '../../lib/types/collectionPoint'
import type { Waste } from '../../lib/types/waste'
import TextFieldFormik from '../uiParts/formInputs/TextFieldFormik'
import { useTranslations } from 'next-intl'

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8

export default function WasteAvailableSubscriptionForm(props: {
  wasteTypes: Waste[]
}) {
  const { wasteTypes } = props
  const { isSubmitting } = useFormikContext<CollectionPoint>()
  const t = useTranslations('CreateUpdateWasteAvailableSubscription.form')
  const tWasteTypes = useTranslations('WasteTypes')

  return (
    <Form>
      <Stack spacing={3}>
        <Box>
          <Field
            id="location"
            name="location"
            variant="outlined"
            fullWidth
            component={PlacesAutocomplete}
            label={t('location.label')}
            helperText={`*${t('location.helperText')}`}
            disabled={isSubmitting}
          />
        </Box>

        <Box>
          <Field
            id="radius"
            name="radius"
            variant="outlined"
            fullWidth
            component={TextFieldFormik}
            label={t('searchRadius.label')}
            helperText={`*${t('searchRadius.helperText')}`}
            type="number"
            inputProps={{ min: 1, max: 200 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {t('searchRadius.endAdornment')}
                </InputAdornment>
              ),
            }}
            disabled={isSubmitting}
          />
        </Box>

        <Box>
          <Field
            id="wasteTypes"
            name="wasteTypes"
            label={t('wasteTypes.label')}
            helperText={`*${t('wasteTypes.helperText')}`}
            component={TextFieldFormik}
            fullWidth
            select
            variant="outlined"
            SelectProps={{
              renderValue: (selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} />
                  ))}
                </Box>
              ),

              multiple: true,

              MenuProps: {
                anchorOrigin: {
                  vertical: 'bottom',
                  horizontal: 'left',
                },
                transformOrigin: {
                  vertical: 'top',
                  horizontal: 'left',
                },
                slotProps: {
                  paper: {
                    style: {
                      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                      width: 250,
                    },
                  },
                },
              },
            }}
          >
            {wasteTypes
              .sort((a, b) =>
                tWasteTypes(a.name).localeCompare(tWasteTypes(b.name)),
              )
              .map((item) => {
                return (
                  <MenuItem
                    sx={{
                      '&.Mui-selected': {
                        background: '#2e3638',
                      },
                    }}
                    key={item._id}
                    value={item.name}
                  >
                    {tWasteTypes(item.name)}
                  </MenuItem>
                )
              })}
          </Field>
        </Box>
        <Box>
          <Button variant="contained" type="submit" disabled={isSubmitting}>
            {t('submit')}
            {isSubmitting && <ButtonSubmittingCircle />}
          </Button>
        </Box>
      </Stack>
    </Form>
  )
}
