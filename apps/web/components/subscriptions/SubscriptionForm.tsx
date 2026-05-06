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
import type { Event } from '../../lib/types/event'
import type { Waste } from '../../lib/types/waste'
import TextFieldFormik from '../uiParts/formInputs/TextFieldFormik'

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8

const SubscriptionForm = (props: { wasteTypes: Waste[] }) => {
  const { wasteTypes } = props
  const { isSubmitting } = useFormikContext<Event>()

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
            label="Местоположение"
            helperText="*Обязательное поле"
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
            label="Радиус поиска, км"
            helperText="*Обязательное поле"
            type="number"
            inputProps={{ min: 1, max: 200 }}
            InputProps={{
              endAdornment: <InputAdornment position="end">Км</InputAdornment>,
            }}
            disabled={isSubmitting}
          />
        </Box>

        <Box>
          <Field
            id="wasteTypes"
            name="wasteTypes"
            label="Типы вторсырья"
            helperText="*Обязательное поле"
            component={TextFieldFormik}
            fullWidth
            select
            color="secondary"
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
            {wasteTypes.map((item) => {
              return (
                <MenuItem
                  sx={{
                    '&.Mui-selected': {
                      background: '#2e3638',
                      // background: '#333b3f',
                    },
                  }}
                  key={item['_id']}
                  value={/*item['_id']*/ item['name']}
                >
                  {item['name']}
                </MenuItem>
              )
            })}
          </Field>
        </Box>
        <Box>
          <Button
            variant="contained"
            color="secondary"
            type="submit"
            disabled={isSubmitting}
          >
            Сохранить
            {isSubmitting && <ButtonSubmittingCircle />}
          </Button>
        </Box>
      </Stack>
    </Form>
  )
}

export default SubscriptionForm
