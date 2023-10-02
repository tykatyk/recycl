import React from 'react'
import Layout from '../layouts/Layout'
import EventForm from './EventForm'
import RedirectUnathenticatedUser from '../uiParts/RedirectUnathenticatedUser'
import { InitialEventData } from '../../lib/types/event'

//ToDo: seems like tihs component can be separated to prevent code duplication
//since it's used also in removal applications
export default function CreateUpdateEvent(props: InitialEventData) {
  const { event } = props
  const title = event
    ? 'Редактировать объявление о вывозе отходов | Recycl'
    : 'Создать объявление о вывозе отходов | Recycl'

  return (
    <RedirectUnathenticatedUser>
      <Layout title={title}>
        <EventForm {...props} />
      </Layout>
    </RedirectUnathenticatedUser>
  )
}
