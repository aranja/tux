import createBrowserHistory from 'history/createBrowserHistory'
import createMemoryHistory from 'history/createMemoryHistory'
import React, { Component, PropTypes } from 'react'

const ContextType = {
  history: PropTypes.object.isRequired,
}

class HistoryProvider extends Component {
  static propTypes = {
    context: PropTypes.shape(ContextType).isRequired,
    children: PropTypes.element.isRequired,
  }

  static childContextTypes = ContextType

  getChildContext() {
    return this.props.context
  }

  render() {
    return React.Children.only(this.props.children)
  }
}

const history = () => ({
  async createElement(renderChildren, context) {
    let { history } = context

    if (!history) {
      if (context.request) {
        history = createMemoryHistory(context.request.url)
      } else {
        history = createBrowserHistory()
        history.listen(context.refresh)
      }

      context.history = history
    }

    const children = await renderChildren()
    return (
      <HistoryProvider context={{ history }}>
        {children}
      </HistoryProvider>
    )
  }
})

export default history
