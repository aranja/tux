import React from 'react'
import UniversalRouter from 'universal-router'
import queryString from 'query-string'

const router = (routes) => ({
  async createElement(_, context) {
    try {
      context.route = await UniversalRouter.resolve(routes, {
        path: context.history.location.pathname,
        query: queryString.parse(context.history.location.search),
      })
      context.htmlProps.title = context.route.title
      return context.route.element
    } catch (error) {
      context.htmlProps.title = error.message
      return (
        <div>
          <h1>404 Page not found</h1>
          {error.message}
        </div>
      )
    }
  },
})

export default router
