import React from 'react'
import UniversalRouter from 'universal-router'
import queryString from 'query-string'

const router = (routes) => ({
  async createElement(renderChildren, context) {
    try {
      return await UniversalRouter.resolve(routes, {
        context,
        path: context.history.location.pathname,
        query: queryString.parse(context.history.location.search),
      })
    } catch (error) {
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
