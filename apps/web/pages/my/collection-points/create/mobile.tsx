import Layout from '../../../../components/layouts/Layout'
import CollectionPointFormCreate from '../../../../components/collectionPoints/CollectionPointFormCreate'
import RedirectUnathenticatedUser from '../../../../components/uiParts/RedirectUnathenticatedUser'
import Head from 'next/head'
import { useTranslations } from 'next-intl'

export default function CreateMobileCollectionPoint() {
  const brand = process.env.NEXT_PUBLIC_BRAND || ''
  const t = useTranslations('CreateMobileCollectionPointPage')

  return (
    <RedirectUnathenticatedUser>
      <Head>
        <title>{`${t('title')} | ${brand}`}</title>
        <meta name="robots" content="noindex, nofollow"></meta>
      </Head>
      <Layout>
        <CollectionPointFormCreate variant={'mobile'} h1={t('h1')} />
      </Layout>
    </RedirectUnathenticatedUser>
  )
}
export async function getStaticProps({ locale }) {
  return {
    props: {
      messages: (await import(`../../../../messages/${locale}.json`)).default,
    },
  }
}
