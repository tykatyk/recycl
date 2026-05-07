import { Box, Button, Typography } from '@mui/material'
import Layout from '../../../../components/layouts/Layout'
export default function WasteAvailableSubscriptions() {
  return (
    <Layout title="Подписки на обьявления о наличии отходов">
      <Box
        sx={{
          margin: 'auto',

          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Typography component={'h1'} variant="h6" paragraph align="center">
          Еще нет ни одной подписки
        </Typography>
        <Typography sx={{ mb: 4 }} align="center">
          Добавьте регион поиска и укажите типы вторсырья, которые вас
          интересуют
        </Typography>
        <Button
          variant="contained"
          href="/my/subscriptions/waste-available/create"
        >
          Добавить
        </Button>
      </Box>
    </Layout>
  )
}
