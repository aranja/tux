import React from 'react'
import UniversalRouter from 'universal-router'
import queryString from 'query-string'

const router = (routes) => ({
  async createElement(renderChildren, context) {
    let element

    try {
      ({ element } = await UniversalRouter.resolve(routes, context.route))
    } catch (error) {
      context.htmlProps.title = error.message
      element = <ErrorReporter error={error}/>
    }

    return element
  },

  wrapClientRender(render, context) {
    context.route = {
      path: window.location.pathname,
      query: queryString.parse(location.search),
      previousLocation: context.route ? context.route.previousLocation : null,
    }
    render()
  }
})

export default router
