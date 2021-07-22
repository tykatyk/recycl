import React from 'react'
import { StaticRouter } from 'react-router'
import CssBaseline from '@material-ui/core/CssBaseline'
import { ThemeProvider, ServerStyleSheets } from '@material-ui/core/styles'

import ReactDOMServer from 'react-dom/server'
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
            <Component />
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
