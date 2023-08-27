import React from 'react'
import { Grid } from '@mui/material'
import Layout from '../layouts/Layout'
import RemovalForm from './RemovalForm'
import RedirectUnathenticatedUser from '../uiParts/RedirectUnathenticatedUser'

export default function RemovalApplication(props) {
  return (
    <RedirectUnathenticatedUser>
      <Layout title="Создать (обновить) заявку на вывоз отходов | Recycl">
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
