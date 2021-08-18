import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Home from './Home.jsx'
import HandOverClaim from './HandOverClaim.jsx'

export default function Routes() {
  return (
    <Router>
      <Switch>
        <Route path="/removal">
          <HandOverClaim />
        </Route>
        <Route exact path="/">
          <Home />
        </Route>
      </Switch>
    </Router>
  )
}
