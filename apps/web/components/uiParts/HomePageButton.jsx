import { Button, Box } from '@mui/material'

import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import { useRouter } from 'next/router'
const buttonText = 'На главную'

export default function HomePageButton() {
  const router = useRouter()
  const handleClick = () => router.push('/')

  return (
    <Box
      sx={{
        margin: 2,
      }}
    >
      <Button
        onClick={handleClick}
        startIcon={<ArrowBackIosIcon />}
        sx={{ color: '#fff' }}
      >
        {buttonText}
      </Button>
    </Box>
  )
}
