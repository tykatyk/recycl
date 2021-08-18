import React from 'react'
import { StaticRouter } from 'react-router'
import CssBaseline from '@material-ui/core/CssBaseline'
import {
  ThemeProvider,
  ServerStyleSheets,
  createMuiTheme
} from '@material-ui/core/styles'
import ReactDOMServer from 'react-dom/server'

import getThemeStub from '../../src/data/theme'

const sheets = new ServerStyleSheets()
const context = {}

export default function serverRenderer(Component, req) {
  const themeStub = getThemeStub('light')
  const theme = createMuiTheme(themeStub)
  const html = ReactDOMServer.renderToString(
    sheets.collect(
      <>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <StaticRouter location={req.originalUrl} context={context}>
            <Component />
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
