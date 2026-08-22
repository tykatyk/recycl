import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import { Box, Button, Typography, Container } from '@mui/material'
import LayoutWithoutHeader from './layouts/LayoutWithoutHeader'
import Head from 'next/head'
import { useTranslations } from 'use-intl'

const homeUrl = '/'
const brand = process.env.NEXT_PUBLIC_BRAND || ''

type ErrorComponentProps = {
  headerText: string
  contentText: string
  title: string
}
export default function ErrorComponent(props: ErrorComponentProps) {
  const { headerText, contentText, title } = props
  const t = useTranslations('ErrorComponent')
  return (
    <>
      <Head>
        <title>{`${title} | ${brand}`}</title>
        <meta name="robots" content="noindex"></meta>
      </Head>
      <LayoutWithoutHeader>
        <Container maxWidth="sm" sx={{ p: 2 }}>
          <Box
            component="main"
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Box
              sx={{
                m: 1,
              }}
            >
              <ErrorOutlineIcon fontSize="large" />
            </Box>
            <Typography
              component="h1"
              variant="h4"
              align="center"
              sx={{ mt: 2, mb: 3 }}
            >
              {headerText}
            </Typography>
            <Typography component="div" align="center" mb={4}>
              {contentText}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Button variant="contained" href={homeUrl}>
                {t('homeBtn')}
              </Button>
            </Box>
          </Box>
        </Container>
      </LayoutWithoutHeader>
    </>
  )
}
