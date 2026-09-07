import Layout from '../../../../components/layouts/Layout'
import WasteAvailableForm from '../../../../components/ads/WasteAvailableForm'
import RedirectUnauthenticatedUser from '../../../../components/uiParts/RedirectUnauthenticatedUser'
import Head from 'next/head'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/router'
import CanonicalUrl from '../../../../components/uiParts/CanonicalUrl'

const brand = process.env.NEXT_PUBLIC_BRAND || ''

export default function CreateAdPage() {
  const router = useRouter()
  const { locale, locales, defaultLocale, asPath } = router
  const t = useTranslations('CreateAdPage')

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
        <WasteAvailableForm h1={t('h1')} />
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
