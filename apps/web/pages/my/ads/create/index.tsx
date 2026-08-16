import Layout from '../../../../components/layouts/Layout'
import RemovalForm from '../../../../components/ads/RemovalForm'
import RedirectUnathenticatedUser from '../../../../components/uiParts/RedirectUnathenticatedUser'
import Head from 'next/head'

const title = 'Добавить объявление о наличии вторсырья'
const brand = process.env.NEXT_PUBLIC_BRAND || ''

export default function CreateUpdate() {
  return (
    <RedirectUnathenticatedUser>
      <Head>
        <title>{`${title} | ${brand}`}</title>
        <meta name="robots" content="noindex, nofollow"></meta>
      </Head>
      <Layout>
        <RemovalForm h1={title} />
      </Layout>
    </RedirectUnathenticatedUser>
  )
}
