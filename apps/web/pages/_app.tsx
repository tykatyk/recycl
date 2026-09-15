import { useMemo } from 'react'
import { CssBaseline } from '@mui/material'
import { ThemeProvider } from '@mui/material/styles'
import { SessionProvider } from 'next-auth/react'
import theme from '../lib/helpers/themeStub'
import GlobalCss from '../components/uiParts/GlobalCss'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import CookieConsentPopup from '../components/uiParts/CookieConsentPopup'
import { SnackbarProvider } from 'notistack'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { NextIntlClientProvider } from 'next-intl'
import { AppProps } from 'next/app'

export default function App(props: AppProps) {
  const router = useRouter()

  const {
    Component,
    pageProps: { session, ...pageProps },
  } = props

  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalCss />
        <SessionProvider session={session}>
          <NextIntlClientProvider
            locale={router.locale}
            messages={pageProps.messages}
            timeZone="Europe/Kiev"
          >
            <SnackbarProvider
              maxSnack={3}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
            >
              <Component {...pageProps} />
            </SnackbarProvider>
            <CookieConsentPopup />
          </NextIntlClientProvider>
        </SessionProvider>
      </ThemeProvider>
    </>
  )
}
