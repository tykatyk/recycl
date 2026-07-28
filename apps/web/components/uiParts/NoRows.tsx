import InfoIcon from '@mui/icons-material/Info'
import { Box } from '@mui/material'

export default function NoRows({ text = 'Нет данных' }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <InfoIcon color="warning" fontSize="large" />
      <Box
        sx={{
          marginTop: 1,
          color: 'warning.main',
        }}
      >
        {text}
      </Box>
    </Box>
  )
}
