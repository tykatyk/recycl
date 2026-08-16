import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import { Box, Button, Typography, Container } from '@mui/material'
import LayoutWithoutHeader from './layouts/LayoutWithoutHeader'
import Head from 'next/head'

const GO_HOME_TEXT = 'На главную'
const HOME_URL = '/'
const brand = process.env.NEXT_PUBLIC_BRAND || ''

type ErrorPageProps = {
  headerText: string
  contentText: string
  title: string
}
export default function ErrorPage(props: ErrorPageProps) {
  const { headerText, contentText, title } = props
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
            <Typography component="h1" variant="h5" mb={3}>
              {headerText}
            </Typography>
            <Typography component="div" align="center" mb={4}>
              {contentText}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Button variant="contained" href={HOME_URL}>
                {GO_HOME_TEXT}
              </Button>
            </Box>
          </Box>
        </Container>
      </LayoutWithoutHeader>
    </>
  )
}
