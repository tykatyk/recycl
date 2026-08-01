import { Button, Box } from '@mui/material'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import { useRouter } from 'next/router'
const buttonText = 'Назад'

export default function BackButton() {
  const router = useRouter()

  return (
    <Box
      sx={{
        margin: 2,
      }}
    >
      <Button
        onClick={() => router.back()}
        startIcon={<ArrowBackIosIcon />}
        sx={{ color: '#fff' }}
      >
        {buttonText}
      </Button>
    </Box>
  )
}
