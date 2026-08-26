import InfoIcon from '@mui/icons-material/Info'
import { Box } from '@mui/material'
import { useTranslations } from 'next-intl'

export default function DataLoadingError() {
  const t = useTranslations('DataLoadingError')
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
        {t('errorMessage')}
      </Box>
    </Box>
  )
}
