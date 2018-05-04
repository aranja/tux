import React, { Fragment } from 'react'
import { Route, Link } from 'react-router-dom'
import Home from './routes/Home'
import About from './routes/About'
import tuxLogo from './tux.svg'

const Page = () => {
  return (
    <Fragment>
      <nav>
        Navigation: <Link to="/">Home</Link> <Link to="/about">About</Link>
      </nav>
      <Route exact path="/" component={Home} />
      <Route path="/about" component={About} />
    </Fragment>
  )
}

export default Page
