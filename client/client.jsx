import React from 'react'
import ReactDOM from 'react-dom'
import CssBaseline from '@material-ui/core/CssBaseline'
import { ThemeProvider } from '@material-ui/core/styles'
import Home from '../components/Home.jsx'
import theme from '../components/theme'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'

function Main() {
  React.useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side')
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles)
    }
  }, [])

  return (
    <>
      <CssBaseline />
      <ThemeProvider theme={theme}>
        <Home />
      </ThemeProvider>
    </>
  )
}

ReactDOM.hydrate(<Main />, document.querySelector('#root'))
if (module.hot) {
  module.hot.accept()
}
