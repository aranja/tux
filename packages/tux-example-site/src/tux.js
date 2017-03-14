import routes from './routes'
import history from './middleware/history'
import router from './middleware/router'
import hot from './middleware/hot'
import createTux from 'tux/lib/tux'

import './reset.css'
import './index.css'
import './megadraft.css'
import './megadraft-fixes.css'

export default createTux()
  .use(history())
  .use(hot(refresh => {module.hot.accept('./routes', refresh)}))
  .use(router(routes))
