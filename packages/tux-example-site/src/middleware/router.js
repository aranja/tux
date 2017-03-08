import React from 'react'
import UniversalRouter from 'universal-router'
import queryString from 'query-string'

const router = (routes) => ({
  async createElement(renderChildren, context) {
    try {
      context.route = await UniversalRouter.resolve(routes, {
        path: context.history.location.pathname,
        query: queryString.parse(context.history.location.search),
      })
      if (context.response) {
        context.response.status(200)
      }
      context.htmlProps.title = context.route.title
      return context.route.element
    } catch (error) {
      context.htmlProps.title = error.message
      if (context.response) {
        context.response.status(404)
      }
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
