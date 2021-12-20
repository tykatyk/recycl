import React from 'react'
import { Grid } from '@material-ui/core'
import Alert from '@material-ui/lab/Alert'
import AuthLayout from './AuthLayout.jsx'

export default function ResetLayout(props) {
  let { title, message, severity = 'error' } = props
  title = title ? `Recycl | ${title}` : 'Recycl'

  return (
    <AuthLayout title={title} backButtonText="На Главную" backButtonTo="/">
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
            justify="center"
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
