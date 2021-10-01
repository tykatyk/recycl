import React from 'react'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import Layout from './Layout.jsx'
import RemovalForm from './removalApplication/RemovalForm.jsx'

export default function RemovalApplication(props) {
  return (
    <Layout>
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