import routes from './routes'
import history from './middleware/history'
import router from './middleware/router'
import createTux from 'tux/lib/tux'

import './reset.css'
import './index.css'
import './megadraft.css'
import './megadraft-fixes.css'

export default createTux()
  .use(history())
  .use(router(routes))
