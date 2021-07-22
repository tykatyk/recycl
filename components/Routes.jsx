import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Header from './Header.jsx'
import Footer from './Footer.jsx'
import Home from './Home.jsx'
import RemovalClaims from './RemovalClaims.jsx'

export default function Routes() {
  return (
    <Router>
      <Header />
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="/removal">
          <RemovalClaims />
        </Route>
      </Switch>
      <Footer />
    </Router>
  )
}
