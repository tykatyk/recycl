import Layout from '../../../../../components/layouts/Layout'
import CollectionPointContainerFormUpdate from '../../../../../components/collectionPoints/CollectionPointContainerFormUpdate'

export default function CreateContainerCollectionPoint() {
  const title = 'Редактировать контейнер приема вторсырья | Recycl'

  return (
    <Layout title={title}>
      <CollectionPointContainerFormUpdate />
    </Layout>
  )
}
