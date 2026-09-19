import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import { Avatar, Box, Button, Typography, Container } from '@mui/material'
import LayoutWithoutHeader from '../../components/layouts/LayoutWithoutHeader'
import Head from 'next/head'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/router'
import CanonicalUrl from '../../components/uiParts/CanonicalUrl'

const homeUrl = '/'
const brand = process.env.NEXT_PUBLIC_BRAND || ''

export default function AuthErrorPage() {
  const t = useTranslations('AuthErrorPage')
  const router = useRouter()
  const { locale, locales, defaultLocale, asPath } = router

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
      <LayoutWithoutHeader>
        <Container component="div" maxWidth="sm" sx={{ p: 2 }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar
              sx={{
                m: 1,
                backgroundColor: 'secondary.main',
              }}
            >
              <ErrorOutlineIcon />
            </Avatar>
            <Typography component="h1" variant="h4" mb={3}>
              {t('errorMessage')}
            </Typography>
            <Typography component="div" align="center" mb={10}>
              {t('linkInvalid')}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Button
                sx={{ mb: 4 }}
                variant="contained"
                href={homeUrl}
                color="secondary"
              >
                {t('homeBtn')}
              </Button>
            </Box>
          </Box>
        </Container>
      </LayoutWithoutHeader>
    </>
  )
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      messages: (await import(`../../messages/${locale}`)).default,
    },
  }
}
