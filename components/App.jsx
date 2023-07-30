import React, { useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'
import { ThemeProvider, CssBaseline } from '@material-ui/core'
import { ApolloProvider } from '@apollo/client'
import { initializeApollo } from '../lib/apolloClient/apolloClient'
import { SessionProvider } from 'next-auth/react'
import theme from '../lib/helpers/themeStub'
import GlobalCss from './uiParts/GlobalCss.jsx'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
const globalStyles = <GlobalCss />
import CookieConsentPopup from './uiParts/CookieConsentPopup.jsx'

export default function App(props) {
  const {
    Component,
    pageProps: { session, ...pageProps },
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
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {globalStyles}
        <SessionProvider session={session}>
          <ApolloProvider client={apolloClient}>
            <Component {...pageProps} />
            <CookieConsentPopup />
          </ApolloProvider>
        </SessionProvider>
      </ThemeProvider>
    </React.Fragment>
  )
}

App.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired,
}
