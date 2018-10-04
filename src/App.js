import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { Switch, Route } from 'react-router'
import { Toolbar } from './components'
import Jumbotron from './components/Jumbotron';

const Home = () => {
  return <Jumbotron />
}

const Migrations = () => {
  return <h1>Hey From Migrations</h1>
}

const Footer = () => {
  return (
    <div>
      Hey I'm a Footer
    </div>
  )
}

export default (props) => {
  console.log(props)
  return (
    <Router>
      <div>
        <Toolbar />
        <Switch>
          <Route
            exact path='/'
            component={Home}
          />
          <Route
            exact path='/migrations'
            component={Migrations}
          />
        </Switch>
        <Footer />
      </div>
    </Router>
  )
}