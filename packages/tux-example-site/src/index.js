import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import createContentfulAdapter from 'tux-adapter-contentful'
import { TuxProvider } from 'tux'

import './index.css'

const adapter = createContentfulAdapter({
  space: 'n2difvpz16fj',
  deliveryToken: 'cb34b8fc758364cdbe2b9f73f640ac6ce55311176f9699cf06a0c44325a27208',
  clientId: '7074da10fd8b52237feeccead1462c5c898eaf58a69dc2df08c65b1b306553b6',
  redirectUri: process.env.PUBLIC_URL || `${location.protocol}//${location.host}/`
})

ReactDOM.render(
  <TuxProvider adapter={adapter}>
    <App />
  </TuxProvider>,
  document.getElementById('root')
)
