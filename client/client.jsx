import React from 'react'
import ReactDOM from 'react-dom'
import CssBaseline from '@material-ui/core/CssBaseline'
import { ThemeProvider, makeStyles } from '@material-ui/core/styles'
import Home from '../components/Home.jsx'
import custmizedTheme from '../components/data/theme'
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
//
function Main() {
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
          <Home />
        </div>
      </ThemeProvider>
    </>
  )
}

ReactDOM.hydrate(<Main />, document.querySelector('#root'))
if (module.hot) {
  module.hot.accept()
}
