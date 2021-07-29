import React from 'react'
import { StaticRouter } from 'react-router'
import CssBaseline from '@material-ui/core/CssBaseline'
import {
  ThemeProvider,
  ServerStyleSheets,
  createMuiTheme
} from '@material-ui/core/styles'
import ReactDOMServer from 'react-dom/server'
import Container from '@material-ui/core/Container'
import Wrapper from '../components/Wrapper.jsx'
import Header from '../components/Header.jsx'
import Footer from '../components/Footer.jsx'
import themeStub from '../components/data/theme'

const sheets = new ServerStyleSheets()
const context = {}

export default function serverRenderer(Component, req) {
  const theme = createMuiTheme(themeStub)
  const html = ReactDOMServer.renderToString(
    sheets.collect(
      <>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <StaticRouter location={req.originalUrl} context={context}>
            <Wrapper>
              <Header />
              <Container component="div">
                <Component />
              </Container>
              <Footer />
            </Wrapper>
          </StaticRouter>
        </ThemeProvider>
      </>
    )
  )

  const css = sheets.toString()

  return {
    html,
    css
  }
}
