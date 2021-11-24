import React from 'react'
import { useTheme } from '@material-ui/core'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos'

export default function BackButton(props) {
  const theme = useTheme()
  const { message = 'Назад' } = props

  return (
    <div style={{ marginBottom: theme.spacing(2) }}>
      <Button startIcon={<ArrowBackIosIcon />}>{message}</Button>
    </div>
  )
}
