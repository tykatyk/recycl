import Layout from '../../../../components/layouts/Layout'
import CollectionPointContainerFormCreate from '../../../../components/collectionPoints/CollectionPointContainerFormCreate'

export default function CreateContainerCollectionPoint() {
  const title = 'Добавить пункт приема вторсырья | Recycl'

  return (
    <Layout title={title}>
      <CollectionPointContainerFormCreate />
    </Layout>
  )
}
