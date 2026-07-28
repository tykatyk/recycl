import Layout from '../../../../components/layouts/Layout'
import CollectionPointFormCreate from '../../../../components/collectionPoints/CollectionPointFormCreate'
import RedirectUnathenticatedUser from '../../../../components/uiParts/RedirectUnathenticatedUser'

export default function CreateContainerCollectionPoint() {
  const brand = process.env.NEXT_PUBLIC_BRAND || ''
  const h1 = 'Добавить стационарный пункт сбора вторсырья'
  const title = `${h1} | ${brand}`

  return (
    <RedirectUnathenticatedUser>
      <Layout title={title}>
        <CollectionPointFormCreate variant={'stationery'} h1={h1} />
      </Layout>
    </RedirectUnathenticatedUser>
  )
}
