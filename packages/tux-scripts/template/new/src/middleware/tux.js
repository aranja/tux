import React from 'react'
import { TuxProvider } from 'tux'

const tux = ({ adapter }) => session => {
  session.api = adapter.getQueryApi()

  return async next => {
    const children = await next()
    return (
      <TuxProvider adapter={adapter} onChange={session.refresh}>
        {children}
      </TuxProvider>
    )
  }
}

export default tux
