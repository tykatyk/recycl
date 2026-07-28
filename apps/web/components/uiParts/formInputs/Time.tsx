import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { TextFieldProps, fieldToTextField } from 'formik-mui'
import { useEffect } from 'react'

type TimeProps = {
  label: string
}
export const Time = (props: TextFieldProps) => {
  const {
    form: { setFieldValue, setFieldTouched },
    field: { name },
  } = props
  const { label, error, helperText, value, fullWidth } = fieldToTextField(props)

  useEffect(() => {
    setFieldTouched(name)
  }, [value])

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ru">
      <TimePicker
        label={label}
        onChange={(newValue) => {
          setFieldValue(name, newValue, false)
        }}
        disablePast
        slotProps={{
          popper: {
            sx: {
              '& .MuiDialogActions-root .MuiButtonBase-root': {
                bgcolor: 'secondary.main',
              },
            },
          },
          textField: {
            fullWidth,
            helperText,
            error: !!error,
            name: name,
          },
        }}
      />
    </LocalizationProvider>
  )
}
