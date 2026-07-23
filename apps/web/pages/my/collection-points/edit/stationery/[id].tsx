import Layout from '../../../../../components/layouts/Layout'
import CollectionPointFormUpdate from '../../../../../components/collectionPoints/CollectionPointFormUpdate'
import RedirectUnathenticatedUser from '../../../../../components/uiParts/RedirectUnathenticatedUser'

export default function CreateContainerCollectionPoint() {
  const brand = process.env.NEXT_PUBLIC_BRAND || ''
  const h1 = 'Редактировать информацию о стационарном пункте сбора вторсырья'
  const title = `${h1} | ${brand}`

  return (
    <RedirectUnathenticatedUser>
      <Layout title={title}>
        <CollectionPointFormUpdate variant="stationery" h1={h1} />
      </Layout>
    </RedirectUnathenticatedUser>
  )
}
