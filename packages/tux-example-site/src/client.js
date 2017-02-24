import React from 'react'
import ReactDOM from 'react-dom'
import UniversalRouter from 'universal-router'
import queryString from 'query-string'
import createBrowserHistory from 'history/createBrowserHistory'
import App from './App'
import createApi from './api'
import routes from './routes'

const history = createBrowserHistory()
const container = document.getElementById('root')
let currentLocation = null
let initialRender = true

// Global (context) variables that can be easily accessed from any React component
// https://facebook.github.io/react/docs/context.html
const context = {
  history,
  data: {},
  userAgent: navigator.userAgent,
}

// Switch off the native scroll restoration behavior and handle it manually
// https://developers.google.com/web/updates/2015/09/history-api-scroll-restoration
const scrollPositionsHistory = {}
if (window.history && 'scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual'
}

function scrollToLocation(location, behavior) {
  let left = 0
  let top = 0
  const pos = scrollPositionsHistory[location.key]
  if (pos) {
    left = pos.scrollX
    top = pos.scrollY
  } else {
    const targetHash = location.hash.substr(1)
    if (targetHash) {
      const target = document.getElementById(targetHash)
      if (target) {
        top = window.pageYOffset + target.getBoundingClientRect().top
      }
    }
  }

  window.scrollTo({ left, top, behavior })
}

function onRenderComplete(route, location) {
  document.title = route.title

  if (initialRender) {
    initialRender = false
    return
  }

  // Restore the scroll position if it was saved into the state
  // or scroll to the given #hash anchor
  // or scroll to top of the page
  // unless manually cancelled
  if (route.scroll !== false) {
    scrollToLocation(location)
  }

  // Google Analytics tracking. Don't send 'pageview' event after
  // the initial rendering, as it was already sent
  if (window.ga) {
    window.ga('send', 'pageview', location.pathname)
  }
}

async function onLocationChange(location) {
  const previousLocation = currentLocation
  currentLocation = location

  // Remember the latest scroll position for the previous location
  if (previousLocation) {
    scrollPositionsHistory[previousLocation.key] = {
      scrollX: window.pageXOffset,
      scrollY: window.pageYOffset,
    }
  }
  // Delete stored scroll position for next page if any
  if (history.action === 'PUSH') {
    delete scrollPositionsHistory[location.key]
  }

  // If only the hash changed, skip to scrolling.
  if (previousLocation &&
    location.pathname === previousLocation.pathname &&
    location.search === previousLocation.search &&
    location.hash !== previousLocation.hash
  ) {
    scrollToLocation(location, 'smooth')
    return
  }

  try {
    // Traverses the list of routes in the order they are defined until
    // it finds the first route that matches provided URL path string
    // and whose action method returns anything other than `undefined`.
    const route = await UniversalRouter.resolve(routes, {
      path: location.pathname,
      query: queryString.parse(location.search),
      api,
      previousLocation,
    })

    // Attach route data to the context.
    context.data = route.data

    // Prevent multiple page renders during the routing process
    if (currentLocation.key !== location.key) {
      return
    }

    if (route.redirect) {
      history.replace(route.redirect)
      return
    }

    ReactDOM.render(
      <App context={context}>
        {route.element}
      </App>,
      container,
      () => onRenderComplete(route, location),
    )
  } catch (error) {
    console.error(error) // eslint-disable-line no-console

    // Current url has been changed during navigation process, do nothing
    if (currentLocation.key !== location.key) {
      return
    }

    // Display the error in full-screen for development mode
    if (process.env.NODE_ENV !== 'production') {
      const ErrorReporter = require('redbox-react').default
      document.title = `Error: ${error.message}`

      ReactDOM.render(<ErrorReporter error={error} />, container)
      return
    }

    // Avoid broken navigation in production mode by a full page reload on error
    if (!initialRender) {
      window.location.reload()
    }
  }
}

// Handle client-side navigation by using HTML5 History API
// For more information visit https://github.com/mjackson/history#readme
history.listen(onLocationChange)
onLocationChange(history.location)
