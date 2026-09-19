import Layout from '../../../../components/layouts/Layout'
import CollectionPointFormCreate from '../../../../components/collectionPoints/CollectionPointFormCreate'
import RedirectUnauthenticatedUser from '../../../../components/uiParts/RedirectUnauthenticatedUser'
import Head from 'next/head'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/router'
import CanonicalUrl from '../../../../components/uiParts/CanonicalUrl'

export default function CreateMobileCollectionPoint() {
  const brand = process.env.NEXT_PUBLIC_BRAND || ''
  const router = useRouter()
  const { locale, locales, defaultLocale, asPath } = router
  const t = useTranslations('CreateMobileCollectionPointPage')

  return (
    <RedirectUnauthenticatedUser>
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
        <CollectionPointFormCreate variant={'mobile'} h1={t('h1')} />
      </Layout>
    </RedirectUnauthenticatedUser>
  )
}
export async function getStaticProps({ locale }) {
  return {
    props: {
      messages: (await import(`../../../../messages/${locale}`)).default,
    },
  }
}
