import React from 'react'
import { Button } from '@mui/material'
import { useTheme } from '@mui/material/styles'

import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import { useRouter } from 'next/router'

export default function BackButton(props) {
  const theme = useTheme()
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
    <div
      style={{
        display: 'flex',
        margin: theme.spacing(2),
      }}
    >
      <Button onClick={handleClick} startIcon={<ArrowBackIosIcon />}>
        {text}
      </Button>
    </div>
  )
}
