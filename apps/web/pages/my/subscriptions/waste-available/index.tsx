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
          Еще нет ни одной подписки. Добавьте одну или несколько
        </Typography>
        <Button
          color="secondary"
          variant="contained"
          href="/my/subscriptions/wasteAvailable/create"
        >
          Добавить
        </Button>
      </Box>
    </Layout>
  )
}
