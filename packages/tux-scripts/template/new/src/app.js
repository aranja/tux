import React from 'react'
import createContentfulAdapter from 'tux-adapter-contentful'
import tux from './middleware/tux'
import history from 'react-chain-history'
import createReactChain from 'react-chain'
import Home from './home'

import './index.css'

const publicUrl = process.env.PUBLIC_URL ? process.env.PUBLIC_URL :
  process.env.SERVER ? 'https://localhost:3000' :
    `${location.protocol}//${location.host}/`

// Get your Contentful tokens from https://app.contentful.com/account/profile/developers/applications
const adapter = createContentfulAdapter({
  space: 'CHANGE_ME',
  deliveryToken: 'CHANGE_ME',
  clientId: 'CHANGE_ME',
  redirectUri: publicUrl,
})

export default createReactChain()
  .chain(history())
  .chain(tux({ adapter }))
  .chain(() => () => <Home />)
