import { Box, Typography } from '@mui/material'
import Link from '../uiParts/Link'
import { useTranslations } from 'next-intl'

export default function NotSubscribed(params: { message: string }) {
  const t = useTranslations('CreateUpdateWasteAvailableSubscription')

  return (
    <Box
      sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
      <Typography align="center">{params.message}</Typography>
      <Typography align="center">{`${t('enableNotifications')}:`}</Typography>
      <Typography>
        <Link href="/my/subscriptions">{t('configureSubscriptions')}</Link>
      </Typography>
    </Box>
  )
}
