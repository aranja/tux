import createBrowserHistory from 'history/createBrowserHistory'
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

const history = (config = {}) => ({
  async createElement(renderChildren, context) {
    let { history } = context
    if (!history) {
      context.history = history = createBrowserHistory(config)
      history.listen(context.refresh)
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
