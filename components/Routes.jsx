import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Container from '@material-ui/core/Container'
import CssBaseline from '@material-ui/core/CssBaseline'
import { ThemeProvider } from '@material-ui/core/styles'
import Wrapper from './Wrapper.jsx'
import Header from './Header.jsx'
import Footer from './Footer.jsx'
import Home from './Home.jsx'
import RemovalClaims from './RemovalClaims.jsx'
import custmizedTheme from './data/theme'

export default function Routes() {
  return (
    <Router>
      <CssBaseline />
      <ThemeProvider theme={custmizedTheme}>
        <Wrapper>
          <Header />
          <Container component="div">
            <Switch>
              <Route exact path="/">
                <Home />
              </Route>
              <Route path="/removal">
                <RemovalClaims />
              </Route>
            </Switch>
          </Container>
          <Footer />
        </Wrapper>
      </ThemeProvider>
    </Router>
  )
}
