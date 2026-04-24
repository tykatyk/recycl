import { Grid, Button } from '@mui/material'
import PlacesAutocomplete from '../uiParts/formInputs/PlacesAutocomplete'
import SelectFormik from '../uiParts/formInputs/SelectFormik'
import ButtonSubmittingCircle from '../uiParts/ButtonSubmittingCircle'
import { Form, Field, useFormikContext } from 'formik'
import 'dayjs/locale/ru'
import type { Event } from '../../lib/types/event'
import type { Waste } from '../../lib/types/waste'

const SubscriptionForm = (props: { wasteTypes?: [Waste] }) => {
  const { wasteTypes } = props
  const { isSubmitting } = useFormikContext<Event>()

  return (
    <Form>
      <Grid
        item
        container
        component="fieldset"
        sx={{
          m: 0,
          p: 0,
          mb: 5,
          '& > div': {
            pb: 2,
          },
          '& > div:last-child': {
            pb: 0,
          },
          border: 'none',
        }}
      >
        <Grid item xs={12}>
          <Field
            id="location"
            name="location"
            variant="outlined"
            fullWidth
            component={PlacesAutocomplete}
            label="Населенный пункт"
            helperText="*Обязательное поле"
            disabled={isSubmitting}
          />
        </Grid>

        <Grid item xs={12}>
          <SelectFormik
            data={wasteTypes}
            name={'waste'}
            label={'Тип отходов'}
            helperText={'*Обязательное поле'}
            disabled={isSubmitting}
          />
        </Grid>
      </Grid>

      <Grid item xs={12}>
        <Button
          variant="contained"
          color="secondary"
          type="submit"
          disabled={isSubmitting}
        >
          Сохранить
          {isSubmitting && <ButtonSubmittingCircle />}
        </Button>
      </Grid>
    </Form>
  )
}

export default SubscriptionForm
