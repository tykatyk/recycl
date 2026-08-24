import InfoIcon from '@mui/icons-material/Info'
import { Box } from '@mui/material'
import { useTranslations } from 'next-intl'

export default function NoRows(props: { text?: string }) {
  const t = useTranslations('NoRows')
  const { text = t('noData') } = props
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
