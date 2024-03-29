import { Grid, Typography, Button } from '@mui/material'
import PlacesAutocomplete from '../uiParts/formInputs/PlacesAutocomplete'
import TextFieldFormik from '../uiParts/formInputs/TextFieldFormik'
import SelectFormik from '../uiParts/formInputs/SelectFormik'
import ButtonSubmittingCircle from '../uiParts/ButtonSubmittingCircle'
import { DateTime } from '../uiParts/formInputs/DateTime'
import { Form, Field, useFormikContext } from 'formik'
import 'dayjs/locale/ru'
import type { Event } from '../../lib/types/event'
import type { Waste } from '../../lib/types/waste'

const EventForm = (props: { wasteTypes?: [Waste] }) => {
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
          <Field
            id="date"
            name="date"
            variant="outlined"
            fullWidth
            component={DateTime}
            label="Дата и время"
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

        <Grid item xs={12}>
          <Field
            component={TextFieldFormik}
            label="Телефон"
            color="secondary"
            type="tel"
            fullWidth
            name="phone"
            variant="outlined"
            helperText="*Обязательное поле"
            disabled={isSubmitting}
          />
        </Grid>
        <Grid item xs={12}>
          <Field
            component={TextFieldFormik}
            multiline
            rows={3}
            variant="outlined"
            fullWidth
            name="comment"
            label="Примечание"
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

export default EventForm
