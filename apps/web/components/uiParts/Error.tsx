import InfoIcon from '@mui/icons-material/Info'
import { Box } from '@mui/material'

export default function Error() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <InfoIcon color="error" fontSize="large" />
      <Box
        sx={{
          marginTop: 1,
          color: 'error.main',
        }}
      >
        Ошибка при загрузке данных
      </Box>
    </Box>
  )
}
