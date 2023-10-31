import InfoIcon from '@mui/icons-material/Info'
import { Box } from '@mui/material'

export default function NoRows() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <InfoIcon color="secondary" fontSize="large" />
      <Box
        sx={{
          marginTop: 1,
          color: 'secondary.main',
        }}
      >
        Нет данных
      </Box>
    </Box>
  )
}
