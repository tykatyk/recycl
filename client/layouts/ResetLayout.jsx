import React from 'react'
import { Grid } from '@material-ui/core'
import Alert from '@material-ui/lab/Alert'
import AuthLayout from './AuthLayout.jsx'

export default function ResetLayout(props) {
  return (
    <AuthLayout
      title="Recycl | Error"
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
            justify="center"
          >
            <Alert variant="filled" severity={props.severity || 'error'}>
              {props.message}
            </Alert>
          </Grid>
        </Grid>
      </Grid>
    </AuthLayout>
  )
}
