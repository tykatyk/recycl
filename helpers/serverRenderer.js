import React from 'react'
import { StaticRouter } from 'react-router'
import CssBaseline from '@material-ui/core/CssBaseline'
import { ThemeProvider, ServerStyleSheets } from '@material-ui/core/styles'
import ReactDOMServer from 'react-dom/server'
import Container from '@material-ui/core/Container'
import Wrapper from '../components/Wrapper.jsx'
import Header from '../components/Header.jsx'
import Footer from '../components/Footer.jsx'
import theme from '../components/data/theme'

const sheets = new ServerStyleSheets()
const context = {}

export default function serverRenderer(Component, req) {
  const html = ReactDOMServer.renderToString(
    sheets.collect(
      <>
        <StaticRouter location={req.baseUrl} context={context}>
          <CssBaseline />
          <ThemeProvider theme={theme}>
            <Wrapper>
              <Header />
              <Container component="div">
                <Component />
              </Container>
              <Footer />
            </Wrapper>
          </ThemeProvider>
        </StaticRouter>
      </>
    )
  )

  const css = sheets.toString()

  return {
    html,
    css
  }
}
