import Layout from '../layouts/Layout'
import EventForm from './EventCreateUpdateUI'
import RedirectUnathenticatedUser from '../uiParts/RedirectUnathenticatedUser'
import type { EventCreateUpdateProps } from '../../lib/types/event'

export default function CreateUpdateEvent(props: EventCreateUpdateProps) {
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
