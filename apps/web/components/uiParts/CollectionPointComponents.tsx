import {
  Grid,
  FormControl,
  InputLabel,
  MenuItem,
  FormHelperText,
  Button,
  TextField,
  Select,
} from '@mui/material'
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import ButtonSubmittingCircle from './ButtonSubmittingCircle'
import PlacesAutocompleteNew from './formInputs/PlacesAutocompleteNew'

export function DateField({ formik }) {
  return (
    <Grid size={{ xs: 12 }}>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ru">
        <DateTimePicker
          name="date"
          slotProps={{
            textField: {
              id: 'date',
              variant: 'outlined',
              fullWidth: true,
              error: formik.touched.date && Boolean(formik.errors.date),
              helperText:
                (formik.touched.date && formik.errors.date) ||
                '*Обязательное поле',
              onBlur: () => formik.setFieldTouched('startDate', true),
            },
          }}
          label="Дата и время начала приема вторсырья"
          disabled={formik.isSubmitting}
          value={formik.values.date}
          onChange={(value) => {
            formik.setFieldValue('date', value)
          }}
          onAccept={() => {
            formik.setFieldTouched('date', true)
          }}
        />
      </LocalizationProvider>
    </Grid>
  )
}

export function PhoneField({ formik }) {
  return (
    <Grid size={{ xs: 12 }}>
      <TextField
        label="Контактный телефон"
        color="secondary"
        type="tel"
        fullWidth
        name="phone"
        variant="outlined"
        helperText={
          (formik.touched.phone && formik.errors.phone) || '*Обязательное поле'
        }
        error={formik.touched.phone && Boolean(formik.errors.phone)}
        value={formik.values.phone}
        disabled={formik.isSubmitting}
        onBlur={formik.handleBlur}
        onChange={formik.handleChange}
      />
    </Grid>
  )
}

export function PlaceAutocompleteField({ collectionPointType, formik }) {
  return (
    <Grid size={{ xs: 12 }}>
      <PlacesAutocompleteNew
        id="location"
        name="location"
        variant="outlined"
        fullWidth
        label={
          collectionPointType === 'mobile'
            ? 'Место приема вторсырья'
            : collectionPointType === 'container'
              ? 'Местоположение сортировочного контейнера'
              : 'Местоположение пункта приема вторсырья'
        }
        value={formik.values.location}
        onChange={(event, newValue) => {
          formik.setFieldValue('location', newValue)
        }}
        onBlur={() => formik.setFieldTouched('location', true)}
        error={formik.touched.location && Boolean(formik.errors.location)}
        helperText={
          (formik.touched.location && formik.errors.location) ||
          '*Обязательное поле'
        }
        disabled={formik.isSubmitting}
      />
    </Grid>
  )
}

export function WasteTypeField({ wasteTypes, formik }) {
  return (
    <Grid size={{ xs: 12 }}>
      <FormControl
        fullWidth
        error={formik.touched.waste && Boolean(formik.errors.waste)}
      >
        <InputLabel id="waste-label">
          {'Типы принимаемого вторсырья'}
        </InputLabel>
        <Select
          id={'waste'}
          name={'waste'}
          multiple
          labelId="demo-simple-select-label"
          disabled={formik.isSubmitting}
          value={formik.values.waste}
          onChange={(event) => {
            const value = event.target.value
            formik.setFieldValue(
              'waste',
              typeof value === 'string' ? value.split(',') : value,
            )
          }}
          onBlur={(event) => {
            formik.setFieldTouched('waste', true)
          }}
          label={'Типы принимаемого вторсырья'}
        >
          {wasteTypes.map((item, index: number) => (
            <MenuItem key={index} value={item.name}>
              {item.name}
            </MenuItem>
          ))}
        </Select>
        <FormHelperText>
          {(formik.touched.waste && formik.errors.waste) ||
            '*Обязательное поле'}
        </FormHelperText>
      </FormControl>
    </Grid>
  )
}

export function CommentField({ formik }) {
  return (
    <Grid size={{ xs: 12 }}>
      <TextField
        multiline
        rows={3}
        variant="outlined"
        fullWidth
        name="comment"
        id="comment"
        label="Описание"
        helperText={formik.touched.comment && formik.errors.comment}
        value={formik.values.comment}
        disabled={formik.isSubmitting}
        onBlur={formik.handleBlur}
        onChange={formik.handleChange}
      />
    </Grid>
  )
}

export function SubmitButton({ formik }) {
  return (
    <Grid size={{ xs: 12 }}>
      <Button variant="contained" type="submit" disabled={formik.isSubmitting}>
        Сохранить
        {formik.isSubmitting && <ButtonSubmittingCircle />}
      </Button>
    </Grid>
  )
}
