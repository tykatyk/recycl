import React from 'react'
import { Grid } from '@mui/material'
import Layout from '../layouts/Layout'
import EventForm from './EventForm'
import RedirectUnathenticatedUser from '../uiParts/RedirectUnathenticatedUser'
import { EventId } from '../../lib/types/event'

//ToDo: seems like tihs component can be separated to prevent code duplication
//since it's used also in removal applications
export default function CreateUpdateEvent(props: EventId) {
  return (
    <RedirectUnathenticatedUser>
      <Layout title="Создать объявление о вывозе отходов | Recycl">
        <Grid
          container
          direction="column"
          style={{
            maxWidth: '750px',
            margin: '0 auto',
            padding: '16px',
          }}
        >
          <EventForm {...props} />
        </Grid>
      </Layout>
    </RedirectUnathenticatedUser>
  )
}
