import React from 'react'
import { Grid } from '@material-ui/core'
import Layout from '../layouts/Layout.jsx'
import RemovalForm from './RemovalForm.jsx'
import RedirectUnathenticatedUser from '../uiParts/RedirectUnathenticatedUser.jsx'

export default function RemovalApplication(props) {
  return (
    <RedirectUnathenticatedUser>
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
    </RedirectUnathenticatedUser>
  )
}
