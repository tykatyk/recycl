import React, { useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'
import { CssBaseline } from '@mui/material'
import { ThemeProvider } from '@mui/material/styles'
import { ApolloProvider } from '@apollo/client'
import { initializeApollo } from '../lib/apolloClient/apolloClient'
import { SessionProvider } from 'next-auth/react'
import theme from '../lib/helpers/themeStub'
import GlobalCss from './uiParts/GlobalCss'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import CookieConsentPopup from './uiParts/CookieConsentPopup'
import { CacheProvider } from '@emotion/react'
import createEmotionCache from '../lib/helpers/createEmotionCache'

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache()

export default function App(props) {
  const {
    Component,
    pageProps: { session, ...pageProps },
    emotionCache = clientSideEmotionCache,
  } = props

  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side')
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles)
    }
  }, [])

  const apolloClient = useMemo(() => initializeApollo(), [])

  return (
    <React.Fragment>
      <CacheProvider value={emotionCache}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <GlobalCss />
          <SessionProvider session={session}>
            <ApolloProvider client={apolloClient}>
              <Component {...pageProps} />
              <CookieConsentPopup />
            </ApolloProvider>
          </SessionProvider>
        </ThemeProvider>
      </CacheProvider>
    </React.Fragment>
  )
}

App.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired,
}
