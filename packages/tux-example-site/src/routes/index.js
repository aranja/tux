import React from 'react'
import createContentfulAdapter from 'tux-adapter-contentful'
import { TuxProvider } from 'tux'
import Home from './Home'
import About from './About'

const adapter = createContentfulAdapter({
  space: 'n2difvpz16fj',
  deliveryToken: 'cb34b8fc758364cdbe2b9f73f640ac6ce55311176f9699cf06a0c44325a27208',
  clientId: '7074da10fd8b52237feeccead1462c5c898eaf58a69dc2df08c65b1b306553b6',
  redirectUri: process.env.PUBLIC_URL || `${location.protocol}//${location.host}/`
})

// The top-level (parent) route
export default {
  path: '/',

  async action({ next }) {
    const route = await next()

    // Provide default values for title, description etc.
    route.title = route.title ? route.title : 'Title'
    route.description = route.description || 'Desc'
    route.element = (
      <TuxProvider adapter={adapter}>
        {route.element}
      </TuxProvider>
    )

    return route
  },

  // Keep in mind, routes are evaluated in order
  children: [
    {
      path: '/',
      action() {
        return { element: <Home /> }
      }
    },
    {
      path: '/about',
      action() {
        return { element: <About /> }
      }
    },
  ],

}
