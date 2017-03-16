import Helmet from 'react-helmet'

export default () => ({
  wrapServerRender(render, context) {
    render()
    context.htmlProps.helmet = Helmet.rewind()
  }
})
