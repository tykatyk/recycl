import React from 'react'
import { Grid } from '@mui/material'
import Alert from '@mui/material/Alert'
import LayoutWithouHeader from './LayoutWithouHeader'

export default function ResetLayout(props) {
  const { title, message, severity = 'error' } = props

  return (
    <LayoutWithouHeader title={title ? `${title} | Recycl` : 'Recycl'}>
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
            <Alert variant="filled" severity={severity} sx={{ color: '#fff' }}>
              {message}
            </Alert>
          </Grid>
        </Grid>
      </Grid>
    </LayoutWithouHeader>
  )
}
