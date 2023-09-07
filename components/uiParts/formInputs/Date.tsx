import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { fieldToTextField } from 'formik-mui'
import error from 'next/error'
import dayjs from 'dayjs'
import { useState, useMemo } from 'react'
import { DateValidationError } from '@mui/x-date-pickers/models'
import messages from '../../../lib/validation/messages'

const { incorrectValue, dateIsSameOrAfter, dateIsOneYearAfterNow } = messages
const oneYearAfterNow = dayjs().add(1, 'year')

type DateProps = {
  helperText: string
  error?: string
  value: string
  name: string
}
export const Date = (props) => {
  const {
    form: { setFieldValue, setFieldTouched },
    field: { name },
  } = props
  const { helperText, value } = fieldToTextField(props)
  const [error, setError] = useState<DateValidationError | null>(null)

  const errorMessage = useMemo(() => {
    switch (error) {
      case 'maxDate': {
        return dateIsOneYearAfterNow
      }
      case 'minDate': {
        return dateIsSameOrAfter
      }

      case 'invalidDate': {
        return incorrectValue
      }

      default: {
        return ''
      }
    }
  }, [error])

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ru">
      <DatePicker
        label="Дата"
        value={value}
        disablePast
        maxDate={oneYearAfterNow}
        onError={(newError) => {
          console.log(newError)
          setError(newError)
        }}
        onChange={(newValue) => {
          setFieldValue(name, newValue, false)
        }}
        slotProps={{
          textField: {
            helperText: !!error ? errorMessage : helperText,
            // error: !!error,
            name: name,
          },
        }}
      />
    </LocalizationProvider>
  )
}
