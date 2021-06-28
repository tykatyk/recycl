import React from 'react'
import CssBaseline from '@material-ui/core/CssBaseline'
import { ThemeProvider } from '@material-ui/core/styles'
import { ServerStyleSheets } from '@material-ui/core/styles'
import ReactDOMServer from 'react-dom/server'
import theme from '../components/theme'
const sheets = new ServerStyleSheets()

export default function serverRenderer(Component) {
  let html = ReactDOMServer.renderToString(
    sheets.collect(
      <React.Fragment>
        <CssBaseline />
        <ThemeProvider theme={theme}>
          <Component />
        </ThemeProvider>
      </React.Fragment>
    )
  )

  let css = sheets.toString()

  return ({
    html,
    css
  })
}
