import React from 'react'
import App from './App'
import routes from './routes'

// Kick of tux
const tux = createTux({
  loadContainer() {
    return document.getElementById('root')
  }
})

  }
}

tux.startClient()
