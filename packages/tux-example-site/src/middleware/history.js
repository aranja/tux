import createBrowserHistory from 'history/createBrowserHistory'

const history = (config = {}) => ({
  wrapClientRender(render, context) {
    context.history = createBrowserHistory(config)
    render()
  }
})

export default history
