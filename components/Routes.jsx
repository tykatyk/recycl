import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Home from './Home.jsx'
import RemovalClaims from './RemovalClaims.jsx'

export default function Routes() {
  return (
    <Router>
      <Switch>
        <Route path="/removal">
          <RemovalClaims />
        </Route>
        <Route exact path="/">
          <Home />
        </Route>
      </Switch>
    </Router>
  )
}
