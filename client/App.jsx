import React from 'react'
import PropTypes from 'prop-types'
import Head from 'next/head'
import { ThemeProvider, CssBaseline, createMuiTheme } from '@material-ui/core'
import { ApolloProvider } from '@apollo/client'
import appoloClient from '../lib/appoloClient/appoloClient'
import { theme } from './uiParts/themeStub'
import GlobalCss from './uiParts/GlobalCss.jsx'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
const globalStyles = <GlobalCss />

export default function App(props) {
  const { Component, pageProps } = props

  React.useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side')
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles)
    }
  }, [])

  return (
    <React.Fragment>
      <Head>
        <title>Recycl</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {globalStyles}
        <ApolloProvider client={appoloClient}>
          <Component {...pageProps} />
        </ApolloProvider>
      </ThemeProvider>
    </React.Fragment>
  )
}

App.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired,
}
