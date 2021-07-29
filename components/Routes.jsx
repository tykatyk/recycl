import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Container from '@material-ui/core/Container'

import Wrapper from './Wrapper.jsx'
import Header from './Header.jsx'
import Footer from './Footer.jsx'
import Home from './Home.jsx'
import RemovalClaims from './RemovalClaims.jsx'

export default function Routes() {
  return (
    <Router>
      <Wrapper>
        <Header />
        <Container component="div">
          <Switch>
            <Route path="/removal">
              <RemovalClaims />
            </Route>
            <Route exact path="/">
              <Home />
            </Route>
          </Switch>
        </Container>
        <Footer />
      </Wrapper>
    </Router>
  )
}
