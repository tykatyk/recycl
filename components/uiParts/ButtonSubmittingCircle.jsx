import React from 'react'
import { CircularProgress } from '@material-ui/core'

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
