import React from 'react'
import ReactDOM from 'react-dom'

import Routes from './Routes.jsx'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'

function App() {
  React.useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side')
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles)
    }
  }, [])

  return <Routes />
}

ReactDOM.hydrate(<App />, document.querySelector('#root'))
if (module.hot) {
  module.hot.accept()
}
