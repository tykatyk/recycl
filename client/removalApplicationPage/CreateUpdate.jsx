import React from 'react'
import Grid from '@material-ui/core/Grid'
import Layout from '../layouts/Layout.jsx'
import RemovalForm from './RemovalForm.jsx'

export default function RemovalApplication(props) {
  return (
    <Layout title="Recycl | Removal Application">
      <Grid
        container
        direction="column"
        style={{
          maxWidth: '750px',
          margin: '0 auto',
          padding: '16px',
        }}
      >
        <RemovalForm {...props} />
      </Grid>
    </Layout>
  )
}
