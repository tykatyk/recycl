import React from 'react'
import { Button, useTheme } from '@material-ui/core'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos'
import { useRouter } from 'next/router'

export default function BackButton(props) {
  const theme = useTheme()
  const { message = 'Назад', to } = props
  const router = useRouter()
  const handleClick = () => {
    if (to) {
      router.replace(to)
      return
    }

    if (router.query.from) {
      router.replace(router.query.from)
      return
    }

    router.replace('/')
  }

  return (
    <div
      style={{
        display: 'flex',
        margin: theme.spacing(2),
      }}
    >
      <Button onClick={handleClick} startIcon={<ArrowBackIosIcon />}>
        {message}
      </Button>
    </div>
  )
}
