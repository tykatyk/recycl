import React from 'react'
import { Button, Box } from '@mui/material'

import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import { useRouter } from 'next/router'

export default function BackButton(props) {
  const { text = 'Назад', to } = props
  const router = useRouter()
  const handleClick = () => {
    if (to) {
      router.push(to)
      return
    }

    router.back()
  }

  return (
    <Box
      sx={{
        display: 'flex',
        margin: 2,
      }}
    >
      <Button
        onClick={handleClick}
        color={'secondary'}
        startIcon={<ArrowBackIosIcon />}
      >
        {text}
      </Button>
    </Box>
  )
}
