import { Typography, Box, Paper } from '@mui/material'
import Layout from '../components/layouts/Layout'
import Head from 'next/head'
import { useTranslations } from 'next-intl'
import CanonicalUrl from '../components/uiParts/CanonicalUrl'
import { useRouter } from 'next/router'

const btcWallet = '16eboKokCzZaLgvA4WoVgV82pBG5jPNXbA'
const ethWallet = '0xabba15ead95b371a3065b4194012ef345d294b35'
const usdtWallet = '0xabba15ead95b371a3065b4194012ef345d294b35' //(BNB Smart Chain (BEP20))

const brand = process.env.NEXT_PUBLIC_BRAND || ''

export default function SupportUsPage() {
  const router = useRouter()
  const { locale, locales, defaultLocale, asPath } = router

  const t = useTranslations('SupportUsPage')

  return (
    <>
      <Head>
        <title>{`${t('title')} | ${brand}`}</title>
        <CanonicalUrl
          asPath={asPath}
          locale={locale}
          defaultLocale={defaultLocale}
          locales={locales}
        />
      </Head>
      <Layout>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            minWidth: 0,
          }}
        >
          <Typography
            component="h1"
            variant="h4"
            align="center"
            sx={{ mt: 2, mb: 3, width: '100%' }}
          >
            {t('h1')}
          </Typography>
          <Paper>
            <Box
              sx={{
                p: 2,
                '&>*': {
                  mb: 3,
                },
              }}
            >
              <Box>
                <Typography variant="h6" align="center">
                  Bitcoin
                </Typography>
                <Typography
                  align="center"
                  sx={{
                    overflowWrap: 'anywhere',
                  }}
                >
                  {btcWallet}
                </Typography>
              </Box>
              <Box>
                <Typography align="center" variant="h6">
                  Etherum
                </Typography>
                <Typography
                  align="center"
                  sx={{
                    overflowWrap: 'anywhere',
                  }}
                >
                  {ethWallet}
                </Typography>
              </Box>
              <Box>
                <Typography align="center" variant="h6">
                  USDT
                </Typography>
                <Typography
                  align="center"
                  sx={{
                    overflowWrap: 'anywhere',
                  }}
                >
                  <span style={{ display: 'block' }}>{usdtWallet}</span>
                  <Typography
                    component="span"
                    sx={{
                      display: 'block',
                      color: 'grey.500',
                    }}
                  >
                    {'(BNB Smart Chain (BEP20))'}
                  </Typography>
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Layout>
    </>
  )
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      messages: (await import(`../messages/${locale}`)).default,
    },
  }
}
