import React from 'react'
import Home from './Home'

// The top-level (parent) route
export default {
  path: '/',

  // Keep in mind, routes are evaluated in order
  children: [
    Home,
  ],

  async action({ next }) {
    const [route] = await Promise.all([
      // Execute each child route until one of them return the result.
      next(),
    ])

    // Provide default values for title, description etc.
    route.title = route.title ? `${route.title}` : 'Title'
    route.description = route.description || 'Desc'
    route.element = (
      <div>
        {route.element}
      </div>
    )

    return route
  },
}
