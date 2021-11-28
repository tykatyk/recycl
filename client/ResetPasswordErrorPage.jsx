import React from 'react'

import { Grid, Typography } from '@material-ui/core'
import Alert from '@material-ui/lab/Alert'

export default function ResetPasswordError() {
  const router = useRouter()

  return (
    <Grid
      container
      justify="center"
      alignItems="center"
      direction="column"
      style={{ minHeight: '100vh' }}
      spacing={5}
    >
      <Grid item>
        <Text />
      </Grid>
    </Grid>
  )
}

const Text = () => {
  return (
    <Grid container direction="column" alignItems="center" justify="center">
      <Alert severity="error">Срок действия токена истек</Alert>
    </Grid>
  )
}
