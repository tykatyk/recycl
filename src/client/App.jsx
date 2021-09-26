import React from 'react'
import PropTypes from 'prop-types'
import Head from 'next/head'
import { ThemeProvider, CssBaseline, createMuiTheme } from '@material-ui/core'
import { theme } from './helpers/themeStub'

import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'

import {
  ApolloClient,
  ApolloLink,
  InMemoryCache,
  ApolloProvider,
  HttpLink,
  from,
} from '@apollo/client'

const httpLink = new HttpLink({ uri: '/api/g' })

const clearTypeNameLink = new ApolloLink((operation, forward) => {
  if (operation.variables) {
    const omitTypename = (key, value) =>
      key === '__typename' ? undefined : value
    operation.variables = JSON.parse(
      JSON.stringify(operation.variables),
      omitTypename
    )
  }
  return forward(operation).map((data) => {
    return data
  })
})

const additiveLink = from([clearTypeNameLink, httpLink])

const client = new ApolloClient({
  link: additiveLink,
  cache: new InMemoryCache(),
  connectToDevTools: true,
})

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
        <ApolloProvider client={client}>
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
