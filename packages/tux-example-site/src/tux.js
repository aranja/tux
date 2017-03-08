import app from './App'
import routes from './routes'
import history from './middleware/history'
import router from './middleware/router'
import createTux from 'tux/lib/tux'

const tux = createTux()

tux.use(history())
tux.use(router(routes))
tux.use(app())

export default tux
