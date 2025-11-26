import React from 'react'
import { Button, Box } from '@mui/material'

import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import { useRouter } from 'next/router'

export default function BackButton({ text = 'Назад' }) {
  const router = useRouter()
  const handleClick = () => router.back()

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
        {text}
      </Button>
    </Box>
  )
}
