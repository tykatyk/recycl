import { Box } from '@mui/material'
import Layout from '../../../components/layouts/Layout'
import ScrollTopButton from '../../../components/uiParts/ScrollToTopButton'
import RedirectUnauthenticatedUser from '../../../components/uiParts/RedirectUnauthenticatedUser'
import MyAdsList from '../../../components/ads/MyAdsList'
import Head from 'next/head'
import { useTranslations } from 'next-intl'
import CanonicalUrl from '../../../components/uiParts/CanonicalUrl'
import { useRouter } from 'next/router'

const brand = process.env.NEXT_PUBLIC_BRAND || ''

export default function MyAdsDisabled() {
  const router = useRouter()
  const { locale, locales, defaultLocale, asPath } = router
  const t = useTranslations('MyAdsDisabledPage')

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
        <RedirectUnauthenticatedUser>
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <MyAdsList h1={t('h1')} variant="disabled" />
            <ScrollTopButton />
          </Box>
        </RedirectUnauthenticatedUser>
      </Layout>
    </>
  )
}
export async function getStaticProps({ locale }) {
  return {
    props: {
      messages: (await import(`../../../messages/${locale}.json`)).default,
    },
  }
}
