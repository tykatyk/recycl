import Layout from '../../../../components/layouts/Layout'
import CollectionPointFormCreate from '../../../../components/collectionPoints/CollectionPointFormCreate'
import RedirectUnauthenticatedUser from '../../../../components/uiParts/RedirectUnauthenticatedUser'
import Head from 'next/head'
import { useTranslations } from 'use-intl'

export default function CreateContainerCollectionPoint() {
  const brand = process.env.NEXT_PUBLIC_BRAND || ''
  const t = useTranslations('CreateContainerCollectionPointPage')
  return (
    <RedirectUnauthenticatedUser>
      <Head>
        <title>{`${t('title')} | ${brand}`}</title>
        <meta name="robots" content="noindex, nofollow"></meta>
      </Head>
      <Layout>
        <CollectionPointFormCreate variant={'container'} h1={t('h1')} />
      </Layout>
    </RedirectUnauthenticatedUser>
  )
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      messages: (await import(`../../../../messages/${locale}.json`)).default,
    },
  }
}
