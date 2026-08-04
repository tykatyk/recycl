import { Box, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import Link from './Link'

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
      <Typography gutterBottom>
        Объявление о наличии вторсырья позволяет опубликовать информацию о
        наличии у вас вторсырья, которое вы готовы передать на переработку или
        утилизацию. Оно будет особенно полезно тем пользователям, у которых
        рядом нет пунктов приема вторсырья данного вида, или они по каким то
        причинам не могут сдать его на местные пункты приема.
      </Typography>

      <Typography gutterBottom>
        После добавления объявления, организации, которые занимаются сбором или
        переработкой данного вида вторсырья смогут увидеть ваше объявление на
        сайте и получат уведомление о добавлении нового объявления.
      </Typography>
      <Typography gutterBottom>
        {'Вы также можете подписаться на получение'}{' '}
        {
          <Link
            href="/my/subscriptions"
            color={'inherit'}
            sx={{ fontWeight: 'fontWeightMedium' }}
          >
            уведомлений
          </Link>
        }{' '}
        {'о появлении пунктов приема вторсырья указанного в ваших объявлениях.'}
      </Typography>
    </Box>
  )
}
