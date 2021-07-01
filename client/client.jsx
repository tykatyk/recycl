import React from 'react'
import ReactDOM from 'react-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/core/styles';
import Home from '../components/Home.jsx';
import theme from '../components/theme';

function Main() {
  React.useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  return (
    <React.Fragment>
      <CssBaseline />
      <ThemeProvider theme={theme}>
        <Home />
      </ThemeProvider>
    </React.Fragment>
  );
}

ReactDOM.hydrate(<Main />, document.querySelector('#root'));
if (module['hot']) {
  module['hot'].accept();
}
