import Layout from '../../../../../components/layouts/Layout'
import CollectionPointFormUpdate from '../../../../../components/collectionPoints/CollectionPointFormUpdate'
import Head from 'next/head'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../../api/auth/[...nextauth]'
import { useTranslations } from 'next-intl'

export default function EditContainerCollectionPoint() {
  const brand = process.env.NEXT_PUBLIC_BRAND || ''
  const t = useTranslations('EditContainerCollectionPointPage')

  return (
    <>
      <Head>
        <title>{`${t('title')} | ${brand}`}</title>
        <meta name="robots" content="noindex, nofollow"></meta>
      </Head>
      <Layout>
        <CollectionPointFormUpdate variant="container" h1={t('h1')} />
      </Layout>
    </>
  )
}

export async function getServerSideProps({ req, res, locale, resolvedUrl }) {
  //ToDo: add server side data fetching
  const session = await getServerSession(req, res, authOptions)

  if (!session) {
    return {
      redirect: {
        destination: `/auth/login?from=${encodeURIComponent(resolvedUrl)}`,
        permanent: false,
      },
    }
  }

  return {
    props: {
      messages: (await import(`../../../../../messages/${locale}.json`))
        .default,
    },
  }
}
