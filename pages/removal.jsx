import React from 'react'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import Layout from '../src/components/Layout.jsx'
import RemovalForm from '../src/components/RemovalForm.jsx'

export default function HandOverClaim() {
  return (
    <Layout>
      <Grid
        container
        direction="column"
        style={{
          maxWidth: '700px',
          margin: '0 auto',
          padding: '16px',
        }}
      >
        <RemovalForm />
      </Grid>
    </Layout>
  )
}
