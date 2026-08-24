import { Box, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import Link from './Link'
import { useTranslations } from 'next-intl'

export const drawerWidth = 280

export const AdWrapper = styled('div', {
  shouldForwardProp: (prop) => prop !== 'drawerOpen',
})<{
  drawerOpen?: boolean
}>(({ theme }) => ({
  flexGrow: 1,
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  variants: [
    {
      props: ({ drawerOpen }) => drawerOpen,
      style: {
        transition: theme.transitions.create('margin', {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
      },
    },
  ],
}))

export function AdsDescription() {
  const t = useTranslations('AdsDescription')
  return (
    <Box
      bgcolor="secondary.main"
      sx={{
        p: 2,
        borderRadius: 2,
        color: 'secondary.contrastText',
        fontSize: '0.875rem',
        fontWeight: 300,

        '& p, & li': {
          fontSize: 'inherit',
          fontWeight: 'inherit',
          color: 'inherit',
        },
      }}
    >
      <Typography gutterBottom>{t('general')}</Typography>

      <Typography gutterBottom>{t('receiveNotification')}</Typography>
      <Typography gutterBottom>
        {t('subscribe')}{' '}
        {
          <Link
            href="/my/subscriptions"
            color={'inherit'}
            sx={{ fontWeight: 'fontWeightMedium' }}
          >
            {t('linkText')}
          </Link>
        }{' '}
        {t('collectionPointsAvailable')}
      </Typography>
    </Box>
  )
}
