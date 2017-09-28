import React from 'react'
import PropTypes from 'prop-types'

class HistoryProvider extends React.Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    children: PropTypes.element.isRequired,
  }

  static childContextTypes = {
    history: PropTypes.object.isRequired,
  }

  getChildContext() {
    return {
      history: this.props.history,
    }
  }

  render() {
    return React.Children.only(this.props.children)
  }
}

import createBrowserHistory from 'history/createBrowserHistory'
import createMemoryHistory from 'history/createMemoryHistory'
import { History } from 'history'
import { CreateElement, Session, Middleware } from 'react-chain'

export default () => session => {
  if (session.req) {
    session.history = createMemoryHistory({
      initialEntries: [session.req.url],
    })
  } else {
    session.history = createBrowserHistory()
    session.history.listen(() => {
      if (session.refresh) {
        session.refresh()
      }
    })
  }

  return async next => {
    const children = await next()
    return (
      <HistoryProvider history={session.history}>{children}</HistoryProvider>
    )
  }
}
