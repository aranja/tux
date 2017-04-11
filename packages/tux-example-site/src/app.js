import createContentfulAdapter from 'tux-adapter-contentful'
import routes from './routes'
import router from './middleware/router'
import tux from './middleware/tux'
import hot from './middleware/hot'
import history from 'react-chain-history'
import helmet from 'react-chain-helmet'
import createReactChain from 'react-chain'

import './reset.css'
import './index.css'
import './icons.css'
import './megadraft.css'
import './megadraft-fixes.css'

const publicUrl = process.env.PUBLIC_URL ? process.env.PUBLIC_URL :
  process.env.SERVER ? 'https://localhost:3000' :
    `${location.protocol}//${location.host}/`

const adapter = createContentfulAdapter({
  space: 'n2difvpz16fj',
  accessToken: '61344f3579f7f80450ffc4bc7111624e1035c9588e9680c02519bce08bbbc3ca',
  host: 'preview.contentful.com',
  clientId: '7074da10fd8b52237feeccead1462c5c898eaf58a69dc2df08c65b1b306553b6',
  redirectUri: publicUrl,
})

export default createReactChain()
  .chain(history())
  .chain(hot(refresh => {module.hot.accept('./routes', refresh)}))
  .chain(tux({ adapter }))
  .chain(helmet())
  .chain(router(routes))
