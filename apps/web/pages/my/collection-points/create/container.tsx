import Layout from '../../../../components/layouts/Layout'
import CollectionPointContainerFormCreate from '../../../../components/collectionPoints/CollectionPointContainerFormCreate'
import RedirectUnathenticatedUser from '../../../../components/uiParts/RedirectUnathenticatedUser'

export default function CreateContainerCollectionPoint() {
  const title = 'Добавить контейнер сбора вторсырья | Recycl'

  return (
    <RedirectUnathenticatedUser>
      <Layout title={title}>
        <CollectionPointContainerFormCreate />
      </Layout>
    </RedirectUnathenticatedUser>
  )
}
