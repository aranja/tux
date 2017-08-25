import React from 'react'
import { Middleware, Session } from 'react-chain'
import { resetKeyGenerator } from 'slate'
import TuxProvider from './components/TuxProvider'
import { Adapter } from './interfaces'

export interface Options {
  adapter: Adapter
}

export interface TuxSession extends Session {
  api: any
}

const tuxMiddleware = ({ adapter }: Options): Middleware => (session: TuxSession) => {
  session.api = adapter.getQueryApi()

  if (process.env.SERVER) {
    session.on('server', render => {
      resetKeyGenerator()
      render()
    })
  }

  return async next => {
    const children = await next()
    return (
      <TuxProvider adapter={adapter} onChange={session.refresh}>
        {children}
      </TuxProvider>
    )
  }
}

export default tuxMiddleware
