import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

type TimeProps = {
  label: string
}
export const Time = ({ label = 'Время' }: TimeProps) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ru">
      <TimePicker
        label={label}
        slotProps={{
          popper: {
            sx: {
              '& .MuiDialogActions-root .MuiButtonBase-root': {
                bgcolor: 'secondary.main',
              },
            },
          },
        }}
      />
    </LocalizationProvider>
  )
}
