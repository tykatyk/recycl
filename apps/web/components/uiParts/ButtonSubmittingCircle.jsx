import React from 'react'
import { CircularProgress } from '@mui/material'

export default function ButtonSubmittingCircle(props) {
  const { color = 'secondary' } = props

  return (
    <CircularProgress
      size={24}
      color={color}
      style={{
        marginLeft: '1em',
      }}
    />
  )
}
