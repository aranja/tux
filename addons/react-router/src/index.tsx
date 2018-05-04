import React, { ReactElement } from 'react'
import { Middleware } from 'react-chain'
import { DocumentSession, ServerSession } from 'tux'
import { BrowserRouter, StaticRouter } from 'react-router-dom'

const router = (): Middleware => (session: ServerSession) => {
  const context: any = {}

  session.on('server', next => {
    next()

    if (context.url) {
      session.res.redirect(context.status || 302, context.url)
    } else if (context.status) {
      session.res.status(context.status)
    }
  })

  return async next => {
    const children = await next()

    if (!process.env.BROWSER && session.req) {
      return (
        <StaticRouter location={session.req.url} context={context}>
          {children}
        </StaticRouter>
      )
    }

    return <BrowserRouter>{children}</BrowserRouter>
  }
}

export default router
