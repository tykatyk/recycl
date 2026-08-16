import Layout from '../../../../../components/layouts/Layout'
import CollectionPointFormUpdate from '../../../../../components/collectionPoints/CollectionPointFormUpdate'
import RedirectUnathenticatedUser from '../../../../../components/uiParts/RedirectUnathenticatedUser'
import Head from 'next/head'

export default function CreateContainerCollectionPoint() {
  const brand = process.env.NEXT_PUBLIC_BRAND || ''
  const h1 = 'Редактировать информацию о передвижном пункте сбора вторсырья'
  const title = `${h1} | ${brand}`

  return (
    <RedirectUnathenticatedUser>
      <Head>
        <title>{title}</title>
        <meta name="robots" content="noindex, nofollow"></meta>
      </Head>
      <Layout>
        <CollectionPointFormUpdate variant="mobile" h1={h1} />
      </Layout>
    </RedirectUnathenticatedUser>
  )
}
