import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import { Avatar, Box, Button, Typography, Container } from '@mui/material'
import AuthLayout from './layouts/AuthLayout'

const GO_HOME_TEXT = 'На главную'
const PAGE_NOT_FOUND_HEADER_TEXT = 'Страница не найдена'
const PAGE_NOT_FOUND_TEXT =
  'Запрашиваемая вами страница не найдена на этом сервере'
const HOME_URL = '/'

export default function PageNotFound() {
  return (
    <AuthLayout title="Recycl | Страница не найдена">
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
            {PAGE_NOT_FOUND_HEADER_TEXT}
          </Typography>
          <Typography component="div" align="center" mb={10}>
            {PAGE_NOT_FOUND_TEXT}
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
