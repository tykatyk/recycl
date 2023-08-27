import React from 'react'
import { Grid } from '@mui/material'
import Alert from '@mui/material/Alert'
import AuthLayout from './AuthLayout'

export default function ResetLayout(props) {
  const { title, message, severity = 'error' } = props

  return (
    <AuthLayout
      title={title ? `${title} | Recycl` : 'Recycl'}
      backButtonText="На Главную"
      backButtonTo="/"
    >
      <Grid
        container
        alignItems="center"
        direction="column"
        style={{ flex: '1 0 auto' }}
      >
        <Grid item>
          <Grid
            container
            direction="column"
            alignItems="center"
            justifyContent="center"
          >
            <Alert variant="filled" severity={severity}>
              {message}
            </Alert>
          </Grid>
        </Grid>
      </Grid>
    </AuthLayout>
  )
}
