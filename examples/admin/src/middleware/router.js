import React from 'react'
import UniversalRouter from 'universal-router'
import queryString from 'query-string'

export default routes => session => async () => {
  try {
    return await UniversalRouter.resolve(routes, {
      context: session,
      path: session.history.location.pathname,
      query: queryString.parse(session.history.location.search),
    })
  } catch (error) {
    if (session.res) {
      session.res.status(404)
    }
    return (
      <div>
        <h1>404 Page not found</h1>
        {error.message}
      </div>
    )
  }
}
