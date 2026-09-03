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
import { useTranslations } from 'next-intl'

export function DateField({ formik }) {
  const t = useTranslations('CollectionPointFormUpdate.form')
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
                `*${t('date.helperText')}`,
              onBlur: () => formik.setFieldTouched('date', true),
            },
          }}
          label={t('date.label')}
          disabled={formik.isSubmitting}
          value={formik.values.date}
          onChange={(value) => {
            formik.setFieldValue('date', value)
          }}
        />
      </LocalizationProvider>
    </Grid>
  )
}

export function PhoneField({ formik }) {
  const t = useTranslations('CollectionPointFormUpdate.form')
  return (
    <Grid size={{ xs: 12 }}>
      <TextField
        label={t('phone.label')}
        color="secondary"
        type="tel"
        fullWidth
        name="phone"
        variant="outlined"
        helperText={
          (formik.touched.phone && formik.errors.phone) ||
          `*${t('phone.helperText')}`
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
  const t = useTranslations('CollectionPointFormUpdate.form')
  return (
    <Grid size={{ xs: 12 }}>
      <PlacesAutocompleteNew
        id="location"
        name="location"
        variant="outlined"
        fullWidth
        label={
          collectionPointType === 'mobile'
            ? t('location.label.mobile')
            : collectionPointType === 'container'
              ? t('location.label.container')
              : t('location.label.stationary')
        }
        value={formik.values.location}
        onChange={(event, newValue) => {
          formik.setFieldValue('location', newValue)
        }}
        onBlur={() => formik.setFieldTouched('location', true)}
        error={formik.touched.location && Boolean(formik.errors.location)}
        helperText={
          (formik.touched.location && formik.errors.location) ||
          `*${t('location.helperText')}`
        }
        disabled={formik.isSubmitting}
      />
    </Grid>
  )
}

export function WasteTypeField({ wasteTypes, formik }) {
  const t = useTranslations('CollectionPointFormUpdate.form')

  return (
    <Grid size={{ xs: 12 }}>
      <FormControl
        fullWidth
        error={formik.touched.wasteTypes && Boolean(formik.errors.wasteTypes)}
      >
        <InputLabel id="wasteTypes-label">{t('wasteType.label')}</InputLabel>
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
          label={t('wasteType.label')}
        >
          {wasteTypes.map((item, index: number) => (
            <MenuItem key={index} value={item.name}>
              {item.name}
            </MenuItem>
          ))}
        </Select>
        <FormHelperText>
          {(formik.touched.wasteTypes && formik.errors.wasteTypes) ||
            ` *${t('wasteType.helperText')}`}
        </FormHelperText>
      </FormControl>
    </Grid>
  )
}

export function CommentField({ formik }) {
  const t = useTranslations('CollectionPointFormUpdate.form')
  return (
    <Grid size={{ xs: 12 }}>
      <TextField
        multiline
        rows={3}
        variant="outlined"
        fullWidth
        name="comment"
        id="comment"
        label={t('comment.label')}
        helperText={formik.touched.comment && formik.errors.comment}
        error={formik.touched.comment && Boolean(formik.errors.comment)}
        value={formik.values.comment}
        disabled={formik.isSubmitting}
        onBlur={formik.handleBlur}
        onChange={formik.handleChange}
      />
    </Grid>
  )
}

export function SubmitButton({ formik }) {
  const t = useTranslations('CollectionPointFormUpdate.form')
  return (
    <Grid size={{ xs: 12 }}>
      <Button variant="contained" type="submit" disabled={formik.isSubmitting}>
        {t('submit')}
        {formik.isSubmitting && <ButtonSubmittingCircle />}
      </Button>
    </Grid>
  )
}

export function CollectionPointsDescription() {
  const t = useTranslations('CollectionPointFormUpdate.form.description')

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
      <Typography gutterBottom>{t('intro')}</Typography>

      <Box component="ol" sx={{ pl: 3, pb: 1, m: 0 }}>
        <li>{t('types.sortingContainers')}</li>
        <li>{t('types.mobilePoints')}</li>
        <li>{t('types.stationaryPoints')}</li>
      </Box>

      <Typography gutterBottom>{t('sortingContainers')}</Typography>

      <Typography gutterBottom>{t('mobilePoints')}</Typography>

      <Typography gutterBottom>{t('stationaryPoints')}</Typography>

      <Typography gutterBottom>{t('requirements')}</Typography>
    </Box>
  )
}
