import React from 'react'
import { CircularProgress } from '@material-ui/core'

export default function ButtonSubmittingCircle() {
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
