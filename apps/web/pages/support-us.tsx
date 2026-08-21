import { Typography, Box, Paper } from '@mui/material'
import Layout from '../components/layouts/Layout'
import Head from 'next/head'
import { useTranslations } from 'next-intl'

const btcWallet = '6Le-cZ8dAAAAABgRwLZP_IVBeV8ZJueinte6rm5n'
const ethWallet = '2lkadg9xlkj#laclk98255xkjagsdf'
const usdtWallet = 'aosudifhsadjkfhasdfmasdf'

const brand = process.env.NEXT_PUBLIC_BRAND || ''

export default function SupportUsPage() {
  const t = useTranslations('SupportUsPage')

  return (
    <>
      <Head>
        <title>{`${t('title')} | ${brand}`}</title>
      </Head>
      <Layout>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
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
                <Typography align="center">{btcWallet}</Typography>
              </Box>
              <Box>
                <Typography align="center" variant="h6">
                  Etherum
                </Typography>
                <Typography align="center">{ethWallet}</Typography>
              </Box>
              <Box>
                <Typography align="center" variant="h6">
                  USDT
                </Typography>
                <Typography align="center">{usdtWallet}</Typography>
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
      messages: (await import(`../messages/${locale}.json`)).default,
    },
  }
}
