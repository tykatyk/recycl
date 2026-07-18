import {
  Grid,
  FormControl,
  InputLabel,
  MenuItem,
  FormHelperText,
  Button,
  TextField,
  Select,
  Typography,
  Box,
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
        error={formik.touched.wasteTypes && Boolean(formik.errors.wasteTypes)}
      >
        <InputLabel id="wasteTypes-label">
          {'Типы принимаемого вторсырья'}
        </InputLabel>
        <Select
          id={'wasteTypes'}
          name={'wasteTypes'}
          multiple
          labelId="demo-simple-select-label"
          disabled={formik.isSubmitting}
          value={formik.values.wasteTypes}
          onChange={(event) => {
            const value = event.target.value
            formik.setFieldValue(
              'wasteTypes',
              typeof value === 'string' ? value.split(',') : value,
            )
          }}
          onBlur={(event) => {
            formik.setFieldTouched('wasteTypes', true)
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
          {(formik.touched.wasteTypes && formik.errors.wasteTypes) ||
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

export function CollectionPointsDescription() {
  return (
    <Box
      bgcolor="secondary.main"
      sx={{
        p: 2,
        borderRadius: 2,
        color: 'secondary.contrastText',
        fontSize: '0.875rem',
        fontWeight: 300,

        '& p, & li': {
          fontSize: 'inherit',
          fontWeight: 'inherit',
          color: 'inherit',
        },
      }}
    >
      <Typography gutterBottom>
        Пункты приема вторсырья делятся на три вида:
      </Typography>
      <Box component="ol" sx={{ pl: 3, pb: 1, m: 0 }}>
        <li>Сортировочные контейнеры.</li>
        <li>Передвижные (мобильные) пункты.</li>
        <li>Стационарные пункты.</li>
      </Box>
      <Typography gutterBottom>
        Сортировочные контейнеры это любые емкости для сбора вторсырья, которые
        устанавливаются в магазинах, торговых центрах или на улице. Например
        коробки для сбора отработанных батареек, текстиля и т.д.
      </Typography>
      <Typography gutterBottom>
        Передвижные (мобильные) пункты, это пункты которые принимают вторсырье в
        определенное время и в определенном месте. При добавлении этих пунктов
        необходимо указать дату начала события по сбору вторсырья.
      </Typography>
      <Typography gutterBottom>
        Стационарные пункты, это площадки или здания где принимают вторсырье.
      </Typography>
      <Typography gutterBottom>
        При добавлении пункта приема вторсырья необходимо указать его вид,
        местоположение, типы вторсырья, которые принимаются этим пунктом, а
        также контактный телефон лица, отвечающего за данный пункт.
      </Typography>
    </Box>
  )
}
