import { Box } from '@mui/material'
import Layout from '../../../components/layouts/Layout'
import ScrollTopButton from '../../../components/uiParts/ScrollToTopButton'
import RedirectUnathenticatedUser from '../../../components/uiParts/RedirectUnathenticatedUser'
import MyAdsList from '../../../components/ads/MyAdsList'
import Head from 'next/head'
import { useTranslations } from 'next-intl'

const brand = process.env.NEXT_PUBLIC_BRAND || ''

export default function MyAds() {
  const t = useTranslations('MyAdsPage')
  return (
    <RedirectUnathenticatedUser>
      <Head>
        <title>{`${t('title')} | ${brand}`}</title>
        <meta name="robots" content="noindex, nofollow"></meta>
      </Head>
      <Layout>
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <MyAdsList h1={t('h1')} variant="active" />
          <ScrollTopButton />
        </Box>
      </Layout>
    </RedirectUnathenticatedUser>
  )
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      messages: (await import(`../../../messages/${locale}.json`)).default,
    },
  }
}
