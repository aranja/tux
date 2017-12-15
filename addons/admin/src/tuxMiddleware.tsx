import React from 'react'
import { Middleware, Session } from 'react-chain'
import { resetKeyGenerator } from 'slate'
import TuxProvider from './components/TuxProvider'
import { Adapter } from './interfaces'

export interface Options {
  adapter: Adapter
}

export interface TuxSession extends Session {
  api: any,
  refresh: () => void
}

const tuxMiddleware = ({ adapter }: Options): Middleware => (
  session: TuxSession
) => {
  session.api = adapter.getQueryApi()
  const refresh = session.refresh
  if (!refresh) {
    // tslint:disable-next-line:no-console
    console.error('Can not find tux refresh. Admin functionality may be limited.')
  }

  if (process.env.TUX_BUILD_TARGET === 'server') {
    session.on('server', render => {
      resetKeyGenerator()
      render()
    })
  }

  return async next => {
    const children = await next()
    return (
      <TuxProvider adapter={adapter} onChange={refresh}>
        {children}
      </TuxProvider>
    )
  }
}

export default tuxMiddleware
