import app from './App'
import routes from './routes'
import history from './middleware/history'
import router from './middleware/router'
import createTux from 'tux/lib/tux'

const tux = createTux()

tux.use({
  async createElement(renderChildren, context) {
    context.ssr = typeof context.request === 'object'
    return await renderChildren()
  }
})
tux.use(history())
tux.use(app())
tux.use(router(routes))

export default tux
