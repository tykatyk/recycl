import React from 'react'
import { CircularProgress, useTheme } from '@material-ui/core'

export default function ButtonSubmittingCircle() {
  const theme = useTheme()
  return (
    <CircularProgress
      size={24}
      style={{
        color: theme.palette.secondary.main,
        marginLeft: '1em',
      }}
    />
  )
}
