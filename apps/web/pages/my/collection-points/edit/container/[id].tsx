import Layout from '../../../../../components/layouts/Layout'
import CollectionPointContainerFormUpdate from '../../../../../components/collectionPoints/CollectionPointContainerFormUpdate'
import RedirectUnathenticatedUser from '../../../../../components/uiParts/RedirectUnathenticatedUser'

export default function CreateContainerCollectionPoint() {
  const title = 'Редактировать информацию о контейнере сбора вторсырья | Recycl'

  return (
    <RedirectUnathenticatedUser>
      <Layout title={title}>
        <CollectionPointContainerFormUpdate />
      </Layout>
    </RedirectUnathenticatedUser>
  )
}
