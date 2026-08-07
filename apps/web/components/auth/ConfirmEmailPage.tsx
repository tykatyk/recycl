import { Box, Alert, Button } from '@mui/material'
import LayoutWithoutHeader from '../layouts/LayoutWithoutHeader'
import router from 'next/router'

const brand = process.env.NEXT_PUBLIC_BRAND || ''
const title = `Подтверждение email | ${brand}`

const buttonText = 'На главную'

export default function ConfirmEmailPage({ urlIsValid }) {
  return (
    <LayoutWithoutHeader title={title}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            '&>*': {
              mb: 3,
            },
          }}
        >
          <Box>
            <Alert
              variant="filled"
              severity={urlIsValid ? 'success' : 'error'}
              sx={{ color: '#fff', mb: 2 }}
            >
              {urlIsValid
                ? 'Адрес электронной почты успешно подтвержден'
                : 'Срок действия ссылки истек'}
            </Alert>
          </Box>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <Button
              onClick={() => router.push('/')}
              sx={{ color: '#fff' }}
              variant={'outlined'}
            >
              {buttonText}
            </Button>
          </Box>
        </Box>
      </Box>
    </LayoutWithoutHeader>
  )
}
