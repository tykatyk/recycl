import Layout from '../../../../../components/layouts/Layout'
import CollectionPointFormUpdate from '../../../../../components/collectionPoints/CollectionPointFormUpdate'
import Head from 'next/head'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../../api/auth/[...nextauth]'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/router'
import CanonicalUrl from '../../../../../components/uiParts/CanonicalUrl'

export default function EditMobileCollectionPoint() {
  const brand = process.env.NEXT_PUBLIC_BRAND || ''
  const router = useRouter()
  const { locale, locales, defaultLocale, asPath } = router
  const t = useTranslations('EditMobileCollectionPointPage')

  return (
    <>
      <Head>
        <title>{`${t('title')} | ${brand}`}</title>
        <meta name="robots" content="noindex, nofollow"></meta>
        <CanonicalUrl
          asPath={asPath}
          locale={locale}
          defaultLocale={defaultLocale}
          locales={locales}
        />
      </Head>
      <Layout>
        <CollectionPointFormUpdate variant="mobile" h1={t('h1')} />
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
      messages: (await import(`../../../../../messages/${locale}`)).default,
    },
  }
}
