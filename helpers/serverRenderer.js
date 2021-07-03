import React from 'react'
import CssBaseline from '@material-ui/core/CssBaseline'
import { ThemeProvider , ServerStyleSheets } from '@material-ui/core/styles'

import ReactDOMServer from 'react-dom/server'
import theme from '../components/theme'

const sheets = new ServerStyleSheets()

export default function serverRenderer(Component) {
  const html = ReactDOMServer.renderToString(
    sheets.collect(
      <>
        <CssBaseline />
        <ThemeProvider theme={theme}>
          <Component />
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
