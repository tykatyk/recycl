import React, { useEffect, useMemo } from 'react'
// import PropTypes from 'prop-types'
import { CssBaseline } from '@mui/material'
import { ThemeProvider } from '@mui/material/styles'
import { ApolloProvider } from '@apollo/client/react'
import { initializeApollo } from '../lib/apolloClient/apolloClient'
import { SessionProvider } from 'next-auth/react'
import theme from '../lib/helpers/themeStub'
import GlobalCss from './uiParts/GlobalCss'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import CookieConsentPopup from './uiParts/CookieConsentPopup'
import { SnackbarProvider } from 'notistack'

export default function App(props) {
  const {
    Component,
    pageProps: { session, ...pageProps },
  } = props

  // useEffect(() => {
  //   // Remove the server-side injected CSS.
  //   const jssStyles = document.querySelector('#jss-server-side')
  //   if (jssStyles) {
  //     jssStyles.parentElement.removeChild(jssStyles)
  //   }
  // }, [])

  const apolloClient = useMemo(() => initializeApollo(), [])

  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalCss />
        <SessionProvider session={session}>
          <ApolloProvider client={apolloClient}>
            <SnackbarProvider
              maxSnack={3}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <Component {...pageProps} />
            </SnackbarProvider>
            <CookieConsentPopup />
          </ApolloProvider>
        </SessionProvider>
      </ThemeProvider>
    </>
  )
}
