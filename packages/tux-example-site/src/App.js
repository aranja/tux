import React, { PropTypes } from 'react'
import './reset.css'
import './index.css'
import './megadraft.css'
import './megadraft-fixes.css'
import './icons.css'

// These are the variables that will be accessible from the React context.
const ContextType = {
  history: PropTypes.object.isRequired,
}

/**
 * The top-level React component setting context (global) variables
 * that can be accessed from all the child components.
 *
 * We need to use context variables instead of global variables for
 * universal rendering support.
 *
 * https://facebook.github.io/react/docs/context.html
 *
 * Usage example:
 *
 *   const context = {
 *     history: createBrowserHistory(),
 *     store: createStore(),
 *   }
 *
 *   ReactDOM.render(
 *     <App context={context}>
 *       <Layout>
 *         <LandingPage />
 *       </Layout>
 *     </App>,
 *     container,
 *   )
 */
class App extends React.PureComponent {

  static propTypes = {
    context: PropTypes.shape(ContextType).isRequired,
    children: PropTypes.element.isRequired,
  }

  static childContextTypes = ContextType

  getChildContext() {
    return this.props.context
  }

  render() {
    // NOTE: If you need to add or modify header, footer etc. of the app,
    // please do that inside the Layout component.
    return React.Children.only(this.props.children)
  }
}

export default App
