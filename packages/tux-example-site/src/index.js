import React from 'react'
import App from './App'
import routes from './routes'
import history from './middleware/history'
import router from './middleware/router'
import createTux from 'tux/lib/tux'

// Kick of tux
const tux = createTux({
  loadContainer() {
    return document.getElementById('root')
  }
})

tux.use(history())
tux.use(router(routes))
tux.use({
  async createElement(renderChildren, { history }) {
    const children = await renderChildren()
    return <App context={{ history }}>{children}</App>
  }
})

tux.startClient().then(() => {
  if (window.ga) {
    window.ga('send', 'pageview', location.pathname)
  }
})
