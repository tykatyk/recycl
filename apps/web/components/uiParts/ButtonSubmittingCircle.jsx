import React from 'react'
import { CircularProgress } from '@mui/material'
import { colors } from '../../lib/helpers/themeStub'

export default function ButtonSubmittingCircle(props) {
  // const { color = 'secondary' } = props

  return (
    <CircularProgress
      sx={{ color: '#1a2b34' }}
      size={24}
      // color={color}
      style={{
        marginLeft: '1em',
      }}
    />
  )
}
