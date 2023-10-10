import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'
import { TextFieldProps, fieldToTextField } from 'formik-mui'

const oneYearAfterNow = dayjs().add(1, 'year')

export const Date = (props: TextFieldProps) => {
  const {
    form: { setFieldValue },
    field: { name },
  } = props
  const { error, value, onChange, label, ...rest } = fieldToTextField(props)

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ru">
      <DatePicker
        label={label}
        value={value}
        disablePast
        maxDate={oneYearAfterNow}
        onChange={(newValue) => {
          setFieldValue(name, newValue, true)
        }}
        slotProps={{
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
