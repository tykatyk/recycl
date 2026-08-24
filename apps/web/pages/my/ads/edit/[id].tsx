import Layout from '../../../../components/layouts/Layout'
import WasteAvailableForm from '../../../../components/ads/WasteAvailableForm'
import Head from 'next/head'
import { useTranslations } from 'next-intl'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../api/auth/[...nextauth]'

const brand = process.env.NEXT_PUBLIC_BRAND || ''

export default function EditAd() {
  const t = useTranslations('EditAdPage')
  return (
    <>
      <Head>
        <title>{`${t('title')} | ${brand}`}</title>
        <meta name="robots" content="noindex, nofollow"></meta>
      </Head>
      <Layout>
        <WasteAvailableForm h1={t('h1')} />
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
      messages: (await import(`../../../../messages/${locale}.json`)).default,
    },
  }
}
