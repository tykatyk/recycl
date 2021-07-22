import React from 'react'
import ReactDOM from 'react-dom'
import CssBaseline from '@material-ui/core/CssBaseline'
import { ThemeProvider, makeStyles } from '@material-ui/core/styles'
import Routes from './Routes.jsx'
import custmizedTheme from './data/theme'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'

const useStyles = makeStyles((theme) => ({
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    backgroundColor: '#223c4a'
  }
}))

function App() {
  const classes = useStyles()

  React.useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side')
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles)
    }
  }, [])

  return (
    <>
      <CssBaseline />
      <ThemeProvider theme={custmizedTheme}>
        <div className={classes.wrapper}>
          <Routes />
        </div>
      </ThemeProvider>
    </>
  )
}

ReactDOM.hydrate(<App />, document.querySelector('#root'))
if (module.hot) {
  module.hot.accept()
}
