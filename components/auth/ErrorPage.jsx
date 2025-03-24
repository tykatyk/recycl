import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import { Avatar, Box, Button, Typography, Container } from '@mui/material'
import AuthLayout from '../layouts/AuthLayout'

const GO_HOME_TEXT = 'На главную'
const CANT_ENTER_TEXT = 'Не удалось выполнить вход'
const LINK_INVALID_TEXT = 'Возможно ссылка для входа больше не действительна'
const HOME_URL = '/'

export default function ErrorPage() {
  return (
    <AuthLayout title="Recycl | Ошибка входа">
      <Container component="div" maxWidth="sm" sx={{ p: 2 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar
            sx={{
              m: 1,
              backgroundColor: 'secondary.main',
            }}
          >
            <ErrorOutlineIcon />
          </Avatar>
          <Typography component="h1" variant="h5" mb={3}>
            {CANT_ENTER_TEXT}
          </Typography>
          <Typography component="div" align="center" mb={10}>
            {LINK_INVALID_TEXT}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button
              sx={{ mb: 4 }}
              variant="contained"
              href={HOME_URL}
              color="secondary"
            >
              {GO_HOME_TEXT}
            </Button>
          </Box>
        </Box>
      </Container>
    </AuthLayout>
  )
}
