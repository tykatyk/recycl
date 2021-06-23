import React from 'react'
import { ThemeProvider } from '@material-ui/core/styles'
import red from '@material-ui/core/colors/red'
import { ServerStyleSheets } from '@material-ui/core/styles'
import Header from '../../components/header.jsx'
import ReactDOMServer from 'react-dom/server'
const sheets = new ServerStyleSheets()


const html = ReactDOMServer.renderToString(
  sheets.collect(<Header />)
)
const css = sheets.toString()

export {html, css}
