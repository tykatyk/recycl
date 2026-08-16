import { Box } from '@mui/material'
import Layout from '../../../components/layouts/Layout'
import ScrollTopButton from '../../../components/uiParts/ScrollToTopButton'
import RedirectUnathenticatedUser from '../../../components/uiParts/RedirectUnathenticatedUser'
import MyAdsList from '../../../components/ads/MyAdsList'
import Head from 'next/head'

const brand = process.env.NEXT_PUBLIC_BRAND || ''
const h1 = 'Мои неактивные обьявления о наличии вторсырья'
const title = `${h1} | ${brand}`

export default function MyAds() {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="robots" content="noindex, nofollow"></meta>
      </Head>
      <Layout>
        <RedirectUnathenticatedUser>
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <MyAdsList h1={h1} variant="disabled" />
            <ScrollTopButton />
          </Box>
        </RedirectUnathenticatedUser>
      </Layout>
    </>
  )
}
