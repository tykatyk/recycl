import Layout from '../layouts/Layout'
import EventCreateUpdateUI from './EventCreateUpdateUI'
import type { EventCreateUpdateProps } from '../../lib/types/collectionPoint'

export default function CreateUpdateEvent(props: EventCreateUpdateProps) {
  const { event } = props
  const title = event
    ? 'Редактировать пункт приема вторсырья | Recycl'
    : 'Добавить пункт приема вторсырья | Recycl'

  return (
    <Layout title={title}>
      <EventCreateUpdateUI {...props} />
    </Layout>
  )
}
