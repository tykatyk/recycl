import Layout from '../../../../components/layouts/Layout'
import WasteAvailableForm from '../../../../components/ads/WasteAvailableForm'
import RedirectUnathenticatedUser from '../../../../components/uiParts/RedirectUnathenticatedUser'
import Head from 'next/head'
import { useTranslations } from 'next-intl'

const brand = process.env.NEXT_PUBLIC_BRAND || ''

export default function CreateAdPage() {
  const t = useTranslations('CreateAdPage')

  return (
    <RedirectUnathenticatedUser>
      <Head>
        <title>{`${t('title')} | ${brand}`}</title>
        <meta name="robots" content="noindex, nofollow"></meta>
      </Head>
      <Layout>
        <WasteAvailableForm h1={t('h1')} />
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
