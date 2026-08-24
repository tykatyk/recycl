import { Box } from '@mui/material'
import Layout from '../../../components/layouts/Layout'
import ScrollTopButton from '../../../components/uiParts/ScrollToTopButton'
import RedirectUnathenticatedUser from '../../../components/uiParts/RedirectUnathenticatedUser'
import MyCollectionPointsList from '../../../components/collectionPoints/MyCollectionPointsList'
import Head from 'next/head'
import { useTranslations } from 'next-intl'

const brand = process.env.NEXT_PUBLIC_BRAND || ''

export default function MyStationeryCollectionPoints() {
  const t = useTranslations('MyStationeryCollectionPointsPage')

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
          <MyCollectionPointsList variant="stationery" h1={t('h1')} />
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
