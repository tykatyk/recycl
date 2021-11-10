import React from 'react'
import { CircularProgress } from '@material-ui/core'

export default function PageLoadingCircle() {
  return (
    <div
      style={{
        position: 'fixed',
        top: ' 50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      }}
    >
      <CircularProgress color="secondary" />
    </div>
  )
}
