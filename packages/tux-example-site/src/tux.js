import createContentfulAdapter from 'tux-adapter-contentful'
import routes from './routes'
import history from './middleware/history'
import router from './middleware/router'
import tux from './middleware/tux'
import hot from './middleware/hot'
import helmet from './middleware/helmet'
import createTux from 'tux/lib/tux'

import './reset.css'
import './index.css'
import './megadraft.css'
import './megadraft-fixes.css'

const publicUrl = process.env.PUBLIC_URL ? process.env.PUBLIC_URL :
  process.env.SERVER ? 'https://localhost:3000' :
    `${location.protocol}//${location.host}/`

const adapter = createContentfulAdapter({
  space: 'n2difvpz16fj',
  deliveryToken: 'cb34b8fc758364cdbe2b9f73f640ac6ce55311176f9699cf06a0c44325a27208',
  clientId: '7074da10fd8b52237feeccead1462c5c898eaf58a69dc2df08c65b1b306553b6',
  redirectUri: publicUrl,
})

export default createTux()
  .use(history())
  .use(hot(refresh => {module.hot.accept('./routes', refresh)}))
  .use(tux({ adapter }))
  .use(helmet())
  .use(router(routes))
