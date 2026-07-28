import { Box, Typography } from '@mui/material'
import Link from '../uiParts/Link'

export default function NotSubscribed(params: { message: string }) {
  return (
    <Box
      sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
      <Typography paragraph align="center">
        {params.message}
      </Typography>
      <Typography paragraph align="center">
        Чтобы добавить подписку, включите уведомления, перейдя по ссылке:
      </Typography>
      <Typography>
        <Link href="/my/subscriptions">Управлять подписками</Link>
      </Typography>
    </Box>
  )
}
