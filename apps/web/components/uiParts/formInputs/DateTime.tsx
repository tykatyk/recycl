import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'
import { TextFieldProps, fieldToTextField } from 'formik-mui'

const oneYearAfterNow = dayjs().add(1, 'year')

export const DateTime = (props: TextFieldProps) => {
  const {
    form: { setFieldValue },
    field: { name },
  } = props
  const { error, value, onChange, label, ...rest } = fieldToTextField(props)

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ru">
      <DateTimePicker
        label={label}
        value={value}
        disablePast
        // maxDate={oneYearAfterNow}
        onChange={(newValue) => {
          setFieldValue(name, newValue, true)
        }}
        slotProps={{
          popper: {
            sx: {
              '& .MuiDialogActions-root .MuiButtonBase-root': {
                bgcolor: 'secondary.main',
              },
            },
          },
          textField: {
            ...rest,
            error: !!error,
            name,
          },
        }}
      />
    </LocalizationProvider>
  )
}
